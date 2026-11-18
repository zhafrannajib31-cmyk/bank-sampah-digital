import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { UnitAccessService } from '../../common/services/unit-access.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitAccess: UnitAccessService,
  ) {}

  async getTransactions(customerId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { customerId },
      orderBy: { confirmedAt: 'desc' },
      include: {
        deposit: {
          select: {
            id: true,
            unitId: true,
            status: true,
            submittedAt: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
            address: true,
            serviceStatus: true,
          },
        },
      },
    });

    // Fetch user saldo
    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });

    return transactions.map(t => ({
      id: t.id,
      depositId: t.depositId,
      unitId: t.unitId,
      unitName: t.unit?.name,
      totalWeight: t.totalWeight,
      totalValue: t.totalValue,
      confirmedBy: t.confirmedBy,
      confirmedAt: t.confirmedAt,
      status: t.status,
      createdAt: t.createdAt,
      saldo: user?.saldo ?? '0',
    }));
  }

  /** Petugas: ambil transaksi untuk unit yang ditugaskan (BSD-69). */
  async getTransactionsByUnit(unitId: string, userId: string) {
    // Unit membership check
    await this.unitAccess.assertStaffOfUnit(userId, unitId);

    const transactions = await this.prisma.transaction.findMany({
      where: { unitId, status: 'active' },
      orderBy: { confirmedAt: 'desc' },
      include: {
        deposit: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
            cancelledAt: true,
            cancellationReason: true,
            completedAt: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
            address: true,
            serviceStatus: true,
          },
        },
      },
    });

    // Fetch user saldo (dari token JWT, bukan dari DB)
    // (saldo hanya untuk NASABAH; petugas tidak perlu lihat)
    return transactions.map(t => ({
      id: t.id,
      depositId: t.depositId,
      unitId: t.unitId,
      unitName: t.unit?.name,
      unitAddress: t.unit?.address,
      unitServiceStatus: t.unit?.serviceStatus,
      totalWeight: t.totalWeight,
      totalValue: t.totalValue,
      confirmedBy: t.confirmedBy,
      confirmedAt: t.confirmedAt,
      status: t.status,
      createdAt: t.createdAt,
      deposit: {
        id: t.deposit.id,
        status: t.deposit.status,
        submittedAt: t.deposit.submittedAt,
        cancelledAt: t.deposit.cancelledAt,
        cancellationReason: t.deposit.cancellationReason,
        completedAt: t.deposit.completedAt,
      },
    }));
  }

  async getTransactionDetail(id: string, customerId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        deposit: {
          include: {
            items: {
              include: {
                category: {
                  select: {
                    name: true,
                    description: true,
                  },
                },
              },
            },
            unit: {
              select: {
                id: true,
                name: true,
                address: true,
                serviceStatus: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan.' });
    }

    if (transaction.customerId !== customerId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Anda tidak boleh melihat data ini.' });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: customerId },
    });

    return {
      ...this.mapTransaction(transaction),
      saldo: user?.saldo ?? '0',
    };
  }

  private mapTransaction(transaction: any) {
    return {
      id: transaction.id,
      depositId: transaction.depositId,
      unitId: transaction.unitId,
      unitName: transaction.unit?.name,
      totalWeight: transaction.totalWeight,
      totalValue: transaction.totalValue,
      confirmedBy: transaction.confirmedBy,
      confirmedAt: transaction.confirmedAt,
      status: transaction.status,
      createdAt: transaction.createdAt,
      deposit: {
        id: transaction.deposit.id,
        status: transaction.deposit.status,
        submittedAt: transaction.deposit.submittedAt,
        items: transaction.deposit.items.map((item: any) => ({
          categoryId: item.categoryId,
          categoryName: item.category?.name,
          categoryDescription: item.category?.description,
          estimatedWeight: item.estimatedWeight,
          actualWeight: item.actualWeight,
          unitPriceSnapshot: item.unitPriceSnapshot,
          finalValue: item.finalValue,
          inspectionStatus: item.inspectionStatus,
        })),
      },
    };
  }
}
