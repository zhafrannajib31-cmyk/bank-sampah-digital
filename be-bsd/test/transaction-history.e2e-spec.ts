import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Decimal } from '@prisma/client-runtime-utils';
import { ROLES_KEY } from '../src/common/guards/roles.decorator';
import { PrismaService } from '../src/common/prisma.service';
import { UnitAccessService } from '../src/common/services/unit-access.service';
import { TransactionController } from '../src/modules/transactions/transaction.controller';
import { TransactionService } from '../src/modules/transactions/transaction.service';

const detail = {
  id: 'tx-1',
  depositId: 'dep-1',
  customerId: 'cust-1',
  unitId: 'unit-1',
  totalWeight: new Decimal('3.750'),
  totalValue: new Decimal('21000.00'),
  confirmedBy: 'petugas-1',
  confirmedAt: new Date('2026-11-22T10:00:00Z'),
  createdAt: new Date('2026-11-22T10:00:00Z'),
  status: 'cancelled',
  unit: { id: 'unit-1', name: 'Unit Simulasi', address: 'Jalan Uji', serviceStatus: 'open' },
  events: [
    {
      id: 'event-1',
      eventType: 'CANCELLED_AFTER_CONFIRMATION',
      reason: 'Salah input berat',
      createdAt: new Date('2026-11-22T11:00:00Z'),
    },
  ],
  deposit: {
    id: 'dep-1',
    status: 'dibatalkan',
    submittedAt: new Date('2026-11-22T09:00:00Z'),
    completedAt: new Date('2026-11-22T10:00:00Z'),
    cancellationReason: 'Salah input berat',
    items: [
      {
        id: 'item-1',
        categoryId: 'cat-1',
        category: { name: 'Plastik PET', description: 'Botol (simulasi)' },
        estimatedWeight: new Decimal('2.500'),
        actualWeight: new Decimal('2.250'),
        unitPriceSnapshot: new Decimal('4000.00'),
        lineTotal: new Decimal('9000.00'),
        inspectionStatus: 'pending',
      },
    ],
  },
};

describe('Riwayat dan detail transaksi nasabah (BSD-65)', () => {
  let prisma: any;
  let service: TransactionService;

  beforeEach(async () => {
    prisma = {
      transaction: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue({ ...detail }),
      },
      user: { findUnique: jest.fn().mockResolvedValue({ saldo: new Decimal('21000.00') }) },
    };
    const module = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: prisma },
        { provide: UnitAccessService, useValue: {} },
      ],
    }).compile();
    service = module.get(TransactionService);
  });

  it('riwayat difilter dari token dan diurutkan terbaru lebih dulu', async () => {
    await service.getTransactions('cust-1');

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { customerId: 'cust-1' }, orderBy: { confirmedAt: 'desc' } }),
    );
  });

  it('detail memuat unit, berat, snapshot, nilai per item, dan alasan pembatalan', async () => {
    const result = await service.getTransactionDetail('tx-1', 'cust-1');

    expect(result.unitName).toBe('Unit Simulasi');
    expect(result.deposit.items[0]).toMatchObject({
      actualWeight: expect.any(Decimal),
      unitPriceSnapshot: expect.any(Decimal),
      lineTotal: expect.any(Decimal),
    });
    expect(result.deposit.items[0].lineTotal.toFixed(2)).toBe('9000.00');
    expect(result.deposit.cancellationReason).toBe('Salah input berat');
    expect(result.events[0]).toMatchObject({ eventType: 'CANCELLED_AFTER_CONFIRMATION', reason: 'Salah input berat' });
  });

  it('detail transaksi nasabah lain ditolak tanpa membaca saldo', async () => {
    prisma.transaction.findUnique.mockResolvedValue({ ...detail, customerId: 'cust-2' });

    await expect(service.getTransactionDetail('tx-1', 'cust-1')).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('detail transaksi yang tidak ada mengembalikan NOT_FOUND', async () => {
    prisma.transaction.findUnique.mockResolvedValue(null);

    await expect(service.getTransactionDetail('tx-1', 'cust-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rute riwayat dan detail hanya untuk nasabah', () => {
    const listRoute = Object.getOwnPropertyDescriptor(TransactionController.prototype, 'getTransactions')?.value;
    const detailRoute = Object.getOwnPropertyDescriptor(TransactionController.prototype, 'getTransactionDetail')?.value;
    expect(Reflect.getMetadata(ROLES_KEY, listRoute)).toEqual(['nasabah']);
    expect(Reflect.getMetadata(ROLES_KEY, detailRoute)).toEqual(['nasabah']);
  });
});
