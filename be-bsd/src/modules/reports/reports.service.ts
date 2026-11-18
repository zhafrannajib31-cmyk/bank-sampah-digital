import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { UnitAccessService } from '../../common/services/unit-access.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitAccess: UnitAccessService,
  ) {}

  /**
   * Ringkasan dashboard untuk petugas: jumlah pengajuan dan transaksi harian
   * untuk unit yang ditugaskan.
   * Endpoint: GET /reports/petugas/:unitId
   */
  async getDailySummary(unitId: string, userId: string, limit = 7) {
    // Unit membership check
    await this.unitAccess.assertStaffOfUnit(userId, unitId);

    const today = new Date();
    const days = [];

    // Build last {limit} days
    for (let i = limit - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    // Fetch deposits and transactions for the unit
    const deposits = await this.prisma.deposit.findMany({
      where: { unitId },
      select: {
        submittedAt: true,
      },
    });

    const transactions = await this.prisma.transaction.findMany({
      where: { unitId },
      select: {
        createdAt: true,
      },
    });

    // Count per day
    const depositCounts = new Map<string, number>();
    const transactionCounts = new Map<string, number>();

    // Deposits
    for (const d of deposits) {
      const date = new Date(d.submittedAt).toISOString().split('T')[0];
      depositCounts.set(date, (depositCounts.get(date) ?? 0) + 1);
    }

    // Transactions
    for (const t of transactions) {
      const date = new Date(t.createdAt).toISOString().split('T')[0];
      transactionCounts.set(date, (transactionCounts.get(date) ?? 0) + 1);
    }

    // Build summary
    const summary = days.map((d) => {
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        depositCount: depositCounts.get(dateStr) ?? 0,
        transactionCount: transactionCounts.get(dateStr) ?? 0,
      };
    });

    // Total for period
    const totalDeposits = summary.reduce((s, r) => s + r.depositCount, 0);
    const totalTransactions = summary.reduce((s, r) => s + r.transactionCount, 0);

    return {
      unitId,
      period: {
        start: days[days.length - 1].toISOString().split('T')[0],
        end: days[0].toISOString().split('T')[0],
      },
      data: summary,
      totals: {
        deposits: totalDeposits,
        transactions: totalTransactions,
      },
    };
  }
}
