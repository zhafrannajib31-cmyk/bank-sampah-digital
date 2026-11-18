import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { Decimal } from '@prisma/client-runtime-utils';

@Injectable()
export class DepositService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDepositDto, customerId: string) {
    const unit = await this.prisma.bankSampahUnit.findUnique({
      where: { id: dto.unitId },
    });
    if (!unit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Unit tidak ditemukan.' });
    }
    if (unit.publicationStatus !== 'published') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Unit ini tidak tersedia.' });
    }

    const deposit = await this.prisma.deposit.create({
      data: {
        customerId,
        unitId: dto.unitId,
        status: 'menunggu',
        submittedAt: new Date(),
        items: {
          create: dto.items.map(item => ({
            categoryId: item.categoryId,
            estimatedWeight: item.estimatedWeight,
            inspectionStatus: 'pending',
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapDeposit(deposit);
  }

  async getDeposit(id: string, customerId: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
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
    });

    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }

    if (deposit.customerId !== customerId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Anda tidak boleh melihat data ini.' });
    }

    return this.mapDeposit(deposit);
  }

  async cancelDeposit(id: string, customerId: string, reason: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
    });

    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }

    if (deposit.customerId !== customerId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Anda tidak boleh membatalkan data ini.' });
    }

    if (deposit.status !== 'menunggu') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan dengan status Menunggu yang bisa dibatalkan.' });
    }

    const cancelled = await this.prisma.deposit.update({
      where: { id },
      data: {
        status: 'dibatalkan',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    return this.mapDeposit(cancelled);
  }

  async updateStatus(id: string, petugasId: string, status: 'diproses') {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
    });
    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }
    if (deposit.status !== 'menunggu') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Menunggu yang bisa diproses.' });
    }
    const updated = await this.prisma.deposit.update({
      where: { id },
      data: {
        status,
        processedAt: new Date(),
      },
    });
    await this.prisma.transactionEvent.create({
      data: {
        depositId: updated.id,
        eventType: 'STATUS_UPDATE',
        oldStatus: 'menunggu',
        newStatus: 'diproses',
        actorId: petugasId,
      },
    });
    return this.mapDeposit(updated);
  }

  async updateWeight(id: string, petugasId: string, items: { itemId: string; actualWeight: string }[]) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
    });
    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }
    if (deposit.status !== 'diproses') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Diproses yang bisa input berat.' });
    }
    // Update each item individually
    for (const item of items) {
      const updated = await this.prisma.depositItem.update({
        where: { id: item.itemId },
        data: {
          actualWeight: new Decimal(item.actualWeight),
        },
      });
      if (!updated) {
        throw new NotFoundException({ code: 'NOT_FOUND', message: `Item ${item.itemId} tidak ditemukan.` });
      }
    }
    // Record event
    await this.prisma.transactionEvent.create({
      data: {
        depositId: id,
        eventType: 'WEIGHT_UPDATE',
        oldStatus: 'diproses',
        newStatus: 'diproses',
        actorId: petugasId,
        metadata: { actualWeights: items },
      },
    });
    return this.mapDeposit(deposit);
  }

  async snapshotPrice(id: string, petugasId: string, snapshootData: { categoryId: string; unitPriceSnapshot: string }[]) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
    });
    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }
    if (deposit.status !== 'diproses') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Diproses yang bisa snapshot harga.' });
    }
    // Update each item individually
    for (const snapshoot of snapshootData) {
      const updated = await this.prisma.depositItem.update({
        where: { id: snapshoot.categoryId },
        data: {
          unitPriceSnapshot: new Decimal(snapshoot.unitPriceSnapshot),
        },
      });
      if (!updated) {
        throw new NotFoundException({ code: 'NOT_FOUND', message: `Item ${snapshoot.categoryId} tidak ditemukan.` });
      }
    }
    await this.prisma.transactionEvent.create({
      data: {
        depositId: id,
        eventType: 'PRICE_SNAPSHOT',
        oldStatus: 'diproses',
        newStatus: 'diproses',
        actorId: petugasId,
        metadata: { snapshootData },
      },
    });
    return this.mapDeposit(deposit);
  }

  async calculateValue(id: string, petugasId: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }
    if (deposit.status !== 'diproses') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Diproses yang bisa kalkulasi nilai.' });
    }
    const items = deposit.items;
    let totalWeight = new Decimal(0);
    let totalValue = new Decimal(0);
    for (const item of items) {
      const weight = item.actualWeight ?? '0';
      const price = item.unitPriceSnapshot ?? '0';
      totalWeight = totalWeight.plus(new Decimal(weight));
      totalValue = totalValue.plus(new Decimal(weight).times(new Decimal(price)));
    }
    return {
      totalWeight: totalWeight.toFixed(3),
      totalValue: totalValue.toFixed(2),
      items: items.map(item => ({
        id: item.id,
        categoryId: item.categoryId,
        actualWeight: item.actualWeight,
        unitPriceSnapshot: item.unitPriceSnapshot,
        lineTotal: new Decimal(item.actualWeight ?? '0').times(new Decimal(item.unitPriceSnapshot ?? '0')).toFixed(2),
      })),
    };
  }

  async confirmTransaction(id: string, petugasId: string, idempotencyKey: string) {
    const existing = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      throw new ConflictException({ code: 'DUPLICATE', message: 'Transaksi sudah pernah dikonfirmasi dengan key ini.' });
    }
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }
    if (deposit.status !== 'diproses') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Diproses yang bisa dikonfirmasi.' });
    }
    let totalWeight = new Decimal(0);
    let totalValue = new Decimal(0);
    for (const item of deposit.items) {
      const weight = item.actualWeight ?? '0';
      const price = item.unitPriceSnapshot ?? '0';
      totalWeight = totalWeight.plus(new Decimal(weight));
      totalValue = totalValue.plus(new Decimal(weight).times(new Decimal(price)));
    }
    const result = await this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.create({
        data: {
          depositId: deposit.id,
          customerId: deposit.customerId,
          unitId: deposit.unitId,
          totalWeight,
          totalValue,
          confirmedBy: petugasId,
          status: 'corrected',
          idempotencyKey,
        },
      });
      await prisma.transactionEvent.createMany({
        data: [
          { depositId: deposit.id, transactionId: transaction.id, eventType: 'STATUS_UPDATE', oldStatus: 'diproses', newStatus: 'diproses', actorId: petugasId },
          { depositId: deposit.id, transactionId: transaction.id, eventType: 'STATUS_UPDATE', oldStatus: 'diproses', newStatus: 'selesai', actorId: petugasId },
        ],
      });
      await prisma.deposit.update({
        where: { id },
        data: {
          status: 'selesai',
          completedAt: new Date(),
        },
      });
      return transaction;
    });
    return this.mapTransaction(result);
  }

  private mapDeposit(deposit: any) {
    return {
      id: deposit.id,
      unitId: deposit.unitId,
      status: deposit.status,
      submittedAt: deposit.submittedAt,
      cancelledAt: deposit.cancelledAt,
      cancellationReason: deposit.cancellationReason,
      notes: deposit.notes,
      items: deposit.items.map((item: any) => ({
        id: item.id,
        categoryId: item.categoryId,
        categoryName: item.category?.name,
        categoryDescription: item.category?.description,
        estimatedWeight: item.estimatedWeight,
        actualWeight: item.actualWeight,
        unitPriceSnapshot: item.unitPriceSnapshot,
        inspectionStatus: item.inspectionStatus,
        rejectionReason: item.rejectionReason,
        createdAt: item.createdAt,
      })),
    };
  }

  private mapTransaction(transaction: any) {
    return {
      id: transaction.id,
      depositId: transaction.depositId,
      customerId: transaction.customerId,
      unitId: transaction.unitId,
      totalWeight: transaction.totalWeight,
      totalValue: transaction.totalValue,
      confirmedBy: transaction.confirmedBy,
      confirmedAt: transaction.confirmedAt,
      status: transaction.status,
      idempotencyKey: transaction.idempotencyKey,
    };
  }
}
