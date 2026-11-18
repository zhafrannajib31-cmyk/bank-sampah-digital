import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

/**
 * Shared helper untuk verifikasi keanggotaan unit (petugas/admin).
 * Dipakai di DepositService, TransactionService, ReportsService.
 */
@Injectable()
export class UnitAccessService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifikasi user adalah staff aktif di unit tertentu.
   * Melempar ForbiddenException jika bukan.
   */
  async assertStaffOfUnit(userId: string, unitId: string): Promise<void> {
    const staff = await this.prisma.unitStaff.findUnique({
      where: {
        userId_unitId: { userId, unitId },
      },
    });
    if (!staff || staff.status !== 'active') {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Anda tidak ditugaskan ke unit ini atau tugas tidak aktif.',
        code: 'FORBIDDEN',
      });
    }
  }

  /**
   * Verifikasi user adalah nasabah pemilik deposit/transaksi.
   */
  async assertDepositOwner(depositId: string, customerId: string): Promise<void> {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
      select: { customerId: true },
    });
    if (!deposit || deposit.customerId !== customerId) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Anda tidak boleh mengakses data ini.',
        code: 'FORBIDDEN',
      });
    }
  }

  /**
   * Verifikasi user adalah nasabah pemilik transaksi.
   */
  async assertTransactionOwner(transactionId: string, customerId: string): Promise<void> {
    const tx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      select: { customerId: true },
    });
    if (!tx || tx.customerId !== customerId) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Anda tidak boleh mengakses data ini.',
        code: 'FORBIDDEN',
      });
    }
  }
}