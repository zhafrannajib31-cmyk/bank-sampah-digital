import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.mapTransaction(transaction);
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
