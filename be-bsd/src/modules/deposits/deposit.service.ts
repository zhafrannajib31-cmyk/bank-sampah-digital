import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { Decimal } from '@prisma/client-runtime-utils';
import { UnitAccessService } from '../../common/services/unit-access.service';

@Injectable()
export class DepositService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitAccess: UnitAccessService,
  ) {}

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
        items: { include: { category: { select: { name: true, description: true } } } },
        unit: { select: { id: true, name: true, address: true } },
      },
    });

    return this.withEstimate(deposit);
  }

  /** Daftar pengajuan milik nasabah (terbaru dulu) untuk layar riwayat/beranda. */
  async listDeposits(customerId: string) {
    const deposits = await this.prisma.deposit.findMany({
      where: { customerId },
      orderBy: { submittedAt: 'desc' },
      include: {
        items: { include: { category: { select: { name: true, description: true } } } },
        unit: { select: { id: true, name: true, address: true } },
      },
    });
    return Promise.all(deposits.map(deposit => this.withEstimate(deposit)));
  }

  /**
   * Daftar pengajuan untuk petugas: hanya unit tempat ia bertugas aktif (FR-09, TC-03).
   * Tanpa penugasan aktif → daftar kosong, bukan seluruh data.
   */
  async listUnitDeposits(petugasId: string, status?: string) {
    const statuses = ['menunggu', 'diproses', 'selesai', 'dibatalkan'];
    if (status && !statuses.includes(status)) {
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Status pengajuan tidak dikenal.',
      });
    }

    const staff = await this.prisma.unitStaff.findMany({
      where: { userId: petugasId, status: 'active' },
      select: { unitId: true },
    });
    if (staff.length === 0) return [];

    const deposits = await this.prisma.deposit.findMany({
      where: {
        unitId: { in: staff.map((row) => row.unitId) },
        ...(status ? { status: status as 'menunggu' } : {}),
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        items: { include: { category: { select: { name: true, description: true } } } },
        unit: { select: { id: true, name: true, address: true } },
        customer: { select: { id: true, name: true, phone: true } },
        transaction: { select: { totalValue: true } },
      },
    });
    return Promise.all(
      deposits.map(async (deposit) => ({
        ...(await this.withEstimate(deposit)),
        customerName: deposit.customer?.name ?? null,
        customerPhone: deposit.customer?.phone ?? null,
        finalTotal: deposit.transaction ? deposit.transaction.totalValue.toFixed(2) : null,
      })),
    );
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

    return this.withEstimate(deposit);
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

    if (!reason || reason.trim() === '') {
      throw new BadRequestException({ code: 'BAD_REQUEST', message: 'Alasan pembatalan wajib diisi.' });
    }

    const cancelled = await this.prisma.deposit.update({
      where: { id },
      data: {
        status: 'dibatalkan',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    // Record event for cancellation
    await this.prisma.transactionEvent.create({
      data: {
        depositId: cancelled.id,
        eventType: 'CANCELLED',
        oldStatus: 'menunggu',
        newStatus: 'dibatalkan',
        actorId: customerId,
      },
    });

    // Re-fetch with items for mapping
    const withItems = await this.prisma.deposit.findUnique({
      where: { id: cancelled.id },
      include: { items: true },
    });
    return this.mapDeposit(withItems!);
  }

  // E8: cancellation after confirmation (BSD-62)
  async cancelConfirmed(id: string, customerId: string, reason: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
    });

    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }

    if (deposit.customerId !== customerId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Anda tidak boleh membatalkan data ini.' });
    }

    if (deposit.status !== 'selesai') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Selesai yang bisa dibatalkan setelah konfirmasi.' });
    }

    if (!reason || reason.trim() === '') {
      throw new BadRequestException({ code: 'BAD_REQUEST', message: 'Alasan pembatalan wajib diisi.' });
    }

    const cancelled = await this.prisma.deposit.update({
      where: { id },
      data: {
        status: 'dibatalkan',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });

    // Record event for cancellation after confirmation
    await this.prisma.transactionEvent.create({
      data: {
        depositId: cancelled.id,
        eventType: 'CANCELLED_AFTER_CONFIRMATION',
        oldStatus: 'selesai',
        newStatus: 'dibatalkan',
        actorId: customerId,
        metadata: { reason },
      },
    });

    const withItems = await this.prisma.deposit.findUnique({
      where: { id: cancelled.id },
      include: { items: true },
    });
    return this.mapDeposit(withItems!);
  }

  // E8: correction after confirmation (BSD-62)
  async correctAfterConfirmation(id: string, customerId: string, items: { categoryId: string; actualWeight?: string }[]) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
    });

    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }

    if (deposit.customerId !== customerId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Anda tidak boleh mengkoreksi data ini.' });
    }

    if (deposit.status !== 'selesai') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Selesai yang bisa dikoreksi setelah konfirmasi.' });
    }

    // Update items with actual weight
    for (const item of items) {
      const updated = await this.prisma.depositItem.update({
        where: { id: item.categoryId },
        data: {
          actualWeight: item.actualWeight ? new Decimal(item.actualWeight) : { set: new Decimal(0) },
        },
      });
      if (!updated) {
        throw new NotFoundException({ code: 'NOT_FOUND', message: `Item ${item.categoryId} tidak ditemukan.` });
      }
    }

    // Record event for correction
    await this.prisma.transactionEvent.create({
      data: {
        depositId: deposit.id,
        eventType: 'CORRECTION',
        oldStatus: 'selesai',
        newStatus: 'selesai',
        actorId: customerId,
        metadata: { items, reason: 'Koreksi data setelah konfirmasi' },
      },
    });

    const withItems = await this.prisma.deposit.findUnique({
      where: { id: deposit.id },
      include: { items: true },
    });
    return this.mapDeposit(withItems!);
  }

  // E8: calculate total value for confirmed deposit (BSD-60)
  async calculateConfirmedValue(id: string, _petugasId: string) {
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
    if (deposit.status !== 'selesai') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Selesai yang bisa dihitung nilai.' });
    }
    // Calculate total weight and value
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

  async updateStatus(id: string, petugasId: string, status: 'diproses') {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id },
    });
    if (!deposit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Pengajuan tidak ditemukan.' });
    }
    // Unit membership check
    await this.unitAccess.assertStaffOfUnit(petugasId, deposit.unitId);

    // Status dicek di dalam WHERE agar dua petugas yang menekan bersamaan tidak sama-sama lolos.
    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.deposit.updateMany({
        where: { id, status: 'menunggu' },
        data: { status, processedAt: new Date() },
      });
      if (count === 0) {
        throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Hanya pengajuan Menunggu yang bisa diproses.' });
      }
      await tx.transactionEvent.create({
        data: {
          depositId: id,
          eventType: 'STATUS_UPDATE',
          oldStatus: 'menunggu',
          newStatus: 'diproses',
          actorId: petugasId,
        },
      });
    });

    const withItems = await this.prisma.deposit.findUnique({
      where: { id },
      include: {
        items: { include: { category: { select: { name: true, description: true } } } },
        unit: { select: { id: true, name: true, address: true } },
        customer: { select: { id: true, name: true, phone: true } },
      },
    });
    return {
      ...(await this.withEstimate(withItems)),
      customerName: withItems?.customer?.name ?? null,
      customerPhone: withItems?.customer?.phone ?? null,
    };
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
    // Unit membership check
    await this.unitAccess.assertStaffOfUnit(petugasId, deposit.unitId);

    // Item harus milik pengajuan ini (cegah ubah item pengajuan lain)
    for (const item of items) {
      const { count } = await this.prisma.depositItem.updateMany({
        where: { id: item.itemId, depositId: id },
        data: {
          actualWeight: new Decimal(item.actualWeight),
        },
      });
      if (count === 0) {
        throw new NotFoundException({ code: 'NOT_FOUND', message: `Item ${item.itemId} tidak ditemukan di pengajuan ini.` });
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
    // Re-fetch with items
    const withItems = await this.prisma.deposit.findUnique({
      where: { id },
      include: { items: true },
    });
    return this.mapDeposit(withItems!);
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
    // Unit membership check
    await this.unitAccess.assertStaffOfUnit(petugasId, deposit.unitId);

    // Item dicari per kategori di dalam pengajuan ini, bukan per id item
    for (const snapshoot of snapshootData) {
      const { count } = await this.prisma.depositItem.updateMany({
        where: { depositId: id, categoryId: snapshoot.categoryId },
        data: {
          unitPriceSnapshot: new Decimal(snapshoot.unitPriceSnapshot),
        },
      });
      if (count === 0) {
        throw new NotFoundException({ code: 'NOT_FOUND', message: `Kategori ${snapshoot.categoryId} tidak ada di pengajuan ini.` });
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
    // Re-fetch with items
    const withItems = await this.prisma.deposit.findUnique({
      where: { id },
      include: { items: true },
    });
    return this.mapDeposit(withItems!);
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
    // Unit membership check
    await this.unitAccess.assertStaffOfUnit(petugasId, deposit.unitId);

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
    // Unit membership check
    await this.unitAccess.assertStaffOfUnit(petugasId, deposit.unitId);

    // Idempotent: retry dengan key yang sama mengembalikan transaksi yang sudah ada.
    // Dicek sebelum validasi status supaya retry setelah sukses tidak ditolak.
    const existing = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
      include: {
        deposit: { include: { items: true } },
      },
    });
    if (existing) {
      if (existing.depositId !== deposit.id) {
        throw new ConflictException({ code: 'DUPLICATE', message: 'Kunci idempotensi sudah dipakai pengajuan lain.' });
      }
      return this.mapTransaction(existing);
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
          status: 'active',
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

  /**
   * Harga aktif per kategori pada tanggal berjalan: harga unit menimpa harga global.
   * Dipakai untuk estimasi tampilan (bukan nilai final; nilai final dari penimbangan).
   */
  private async activePrices(unitId: string, categoryIds: string[], at = new Date()) {
    const rows = await this.prisma.wastePrice.findMany({
      where: {
        categoryId: { in: categoryIds },
        status: 'active',
        OR: [{ unitId }, { unitId: null }],
        effectiveFrom: { lte: at },
        AND: [{ OR: [{ effectiveTo: null }, { effectiveTo: { gte: at } }] }],
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    const picked = new Map<string, { price: any; unitSpecific: boolean }>();
    for (const row of rows) {
      const unitSpecific = row.unitId === unitId;
      const current = picked.get(row.categoryId);
      if (!current || (unitSpecific && !current.unitSpecific)) {
        picked.set(row.categoryId, { price: row.pricePerKg, unitSpecific });
      }
    }
    return new Map([...picked].map(([categoryId, value]) => [categoryId, value.price]));
  }

  /** Kode tiket untuk ditampilkan/diucapkan ke petugas. */
  private ticketCode(id: string) {
    return `BSD-${new Date().getFullYear()}-${id.slice(0, 6).toUpperCase()}`;
  }

  /** Pengajuan + estimasi nilai berlabel "bukan nilai final" (FR-08). */
  private async withEstimate(deposit: any) {
    const base = this.mapDeposit(deposit);
    const categoryIds = [...new Set(base.items.map((item: any) => item.categoryId))] as string[];
    const prices = categoryIds.length
      ? await this.activePrices(deposit.unitId, categoryIds, deposit.submittedAt ?? new Date())
      : new Map<string, any>();

    let total = new Decimal(0);
    const items = base.items.map((item: any) => {
      const price = prices.get(item.categoryId) ?? null;
      const estimatedValue =
        price === null ? null : new Decimal(item.estimatedWeight).mul(price).toFixed(2);
      if (estimatedValue !== null) total = total.add(estimatedValue);
      return { ...item, pricePerKg: price, estimatedValue };
    });

    return {
      ...base,
      code: this.ticketCode(deposit.id),
      unitName: deposit.unit?.name ?? null,
      unitAddress: deposit.unit?.address ?? null,
      estimatedTotal: total.toFixed(2),
      estimatedValueLabel: 'bukan nilai final',
      items,
    };
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
      items: (deposit.items ?? []).map((item: any) => ({
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
