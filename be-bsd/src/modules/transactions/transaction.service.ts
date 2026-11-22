import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../../common/prisma.service';
import { UnitAccessService } from '../../common/services/unit-access.service';
import { depositTotals, lineTotalOf } from '../deposits/deposit-totals';
import { CorrectTransactionDto } from './dto/transaction-action.dto';

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

  /**
   * Admin membatalkan transaksi yang sudah Selesai (BSD-62). Status transaksi dan
   * pengajuan diubah bersama event; saldo dihitung ulang dari transaksi aktif.
   */
  async cancelTransaction(id: string, adminId: string, reason: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan.' });
    }
    if (!reason?.trim()) {
      throw new BadRequestException({ code: 'BAD_REQUEST', message: 'Alasan pembatalan wajib diisi.' });
    }

    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.transaction.updateMany({
        where: { id, status: 'active' },
        data: { status: 'cancelled' },
      });
      if (count === 0) {
        throw new ConflictException({ code: 'DUPLICATE', message: 'Transaksi sudah dibatalkan atau dikoreksi.' });
      }
      await tx.deposit.updateMany({
        where: { id: transaction.depositId, status: 'selesai' },
        data: { status: 'dibatalkan', cancelledAt: new Date(), cancellationReason: reason },
      });
      await tx.transactionEvent.create({
        data: {
          depositId: transaction.depositId,
          transactionId: id,
          eventType: 'CANCELLED_AFTER_CONFIRMATION',
          oldStatus: 'active',
          newStatus: 'cancelled',
          actorId: adminId,
          reason,
          metadata: { previousTotalValue: transaction.totalValue.toFixed(2) },
        },
      });
      await this.refreshSaldo(tx, transaction.customerId);
    });

    return this.getTransactionDetail(id, transaction.customerId);
  }

  /** Admin mengoreksi berat pasca-Selesai (BSD-62); nilai lama tetap di event. */
  async correctTransaction(id: string, adminId: string, dto: CorrectTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { deposit: { include: { items: true } } },
    });
    if (!transaction) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan.' });
    }
    if (!dto.reason?.trim()) {
      throw new BadRequestException({ code: 'BAD_REQUEST', message: 'Alasan koreksi wajib diisi.' });
    }

    const knownItems = new Map(transaction.deposit.items.map((item) => [item.id, item]));
    const updates = dto.items.map((item) => {
      const current = knownItems.get(item.itemId);
      if (!current) {
        throw new BadRequestException({ code: 'BAD_REQUEST', message: `Item ${item.itemId} tidak ditemukan pada transaksi ini.` });
      }
      return {
        id: item.itemId,
        actualWeight: new Decimal(item.actualWeight),
        lineTotal: lineTotalOf({ actualWeight: item.actualWeight, unitPriceSnapshot: current.unitPriceSnapshot }),
      };
    });
    const updatesById = new Map(updates.map((item) => [item.id, item]));
    const correctedItems = transaction.deposit.items.map((item) => {
      const change = updatesById.get(item.id);
      return change ? { ...item, actualWeight: change.actualWeight, lineTotal: change.lineTotal } : item;
    });
    const { totalWeight, totalValue } = depositTotals(correctedItems);

    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.transaction.updateMany({
        where: { id, status: 'active' },
        data: { status: 'corrected', totalWeight, totalValue },
      });
      if (count === 0) {
        throw new ConflictException({ code: 'DUPLICATE', message: 'Transaksi sudah dibatalkan atau dikoreksi.' });
      }
      for (const item of updates) {
        await tx.depositItem.update({
          where: { id: item.id },
          data: { actualWeight: item.actualWeight, lineTotal: item.lineTotal },
        });
      }
      await tx.transactionEvent.create({
        data: {
          depositId: transaction.depositId,
          transactionId: id,
          eventType: 'CORRECTION',
          oldStatus: 'active',
          newStatus: 'corrected',
          actorId: adminId,
          reason: dto.reason,
          metadata: {
            previousTotalWeight: transaction.totalWeight.toString(),
            previousTotalValue: transaction.totalValue.toFixed(2),
            totalWeight: totalWeight.toString(),
            totalValue: totalValue.toFixed(2),
            items: dto.items.map((item) => ({ itemId: item.itemId, actualWeight: item.actualWeight })),
          },
        },
      });
      await this.refreshSaldo(tx, transaction.customerId);
    });

    return this.getTransactionDetail(id, transaction.customerId);
  }

  /** Saldo = jumlah transaksi aktif/terkoreksi; dihitung ulang sekali per aksi. */
  private async refreshSaldo(tx: Pick<PrismaService, 'transaction' | 'user'>, customerId: string) {
    const result = await tx.transaction.aggregate({
      where: { customerId, status: { in: ['active', 'corrected'] } },
      _sum: { totalValue: true },
    });
    await tx.user.update({
      where: { id: customerId },
      data: { saldo: result._sum.totalValue ?? 0 },
    });
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
