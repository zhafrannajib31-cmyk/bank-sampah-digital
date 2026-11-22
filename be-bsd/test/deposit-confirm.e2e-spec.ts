import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/common/prisma.service';
import { UnitAccessService } from '../src/common/services/unit-access.service';
import { WastePriceService } from '../src/modules/waste-prices/waste-prices.service';
import { DepositService } from '../src/modules/deposits/deposit.service';

const deposit = {
  id: 'dep-1',
  unitId: 'unit-1',
  customerId: 'cust-1',
  status: 'diproses',
  items: [{ id: 'item-1', actualWeight: '2.250', unitPriceSnapshot: '4000.00' }],
};

const transaction = {
  id: 'tx-1',
  depositId: 'dep-1',
  customerId: 'cust-1',
  unitId: 'unit-1',
  totalWeight: '2.250',
  totalValue: '9000.00',
  confirmedBy: 'petugas-1',
  confirmedAt: new Date(),
  status: 'active',
  idempotencyKey: 'key-1',
};

describe('DepositService.confirmTransaction (BSD-60)', () => {
  let tx: any;
  let prisma: any;
  let unitAccess: any;
  let service: DepositService;

  beforeEach(async () => {
    tx = {
      transaction: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(transaction),
      },
      transactionEvent: { createMany: jest.fn().mockResolvedValue({ count: 2 }) },
      deposit: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    };
    prisma = {
      deposit: { findUnique: jest.fn().mockResolvedValue({ ...deposit }) },
      $transaction: jest.fn(async (callback: (t: any) => unknown) => callback(tx)),
    };
    unitAccess = { assertStaffOfUnit: jest.fn().mockResolvedValue(undefined) };
    const module = await Test.createTestingModule({
      providers: [
        DepositService,
        { provide: PrismaService, useValue: prisma },
        { provide: UnitAccessService, useValue: unitAccess },
        { provide: WastePriceService, useValue: {} },
      ],
    }).compile();
    service = module.get(DepositService);
  });

  it('writes transaction, events, and Selesai status in one DB transaction', async () => {
    const result = await service.confirmTransaction('dep-1', 'petugas-1', 'key-1');

    expect(unitAccess.assertStaffOfUnit).toHaveBeenCalledWith('petugas-1', 'unit-1');
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.deposit.updateMany).toHaveBeenCalledWith({
      where: { id: 'dep-1', status: 'diproses' },
      data: expect.objectContaining({ status: 'selesai', completedAt: expect.any(Date) }),
    });
    expect(tx.transaction.create).toHaveBeenCalledTimes(1);
    expect(tx.transaction.create.mock.calls[0][0].data.totalValue.toFixed(2)).toBe('9000.00');
    expect(tx.transactionEvent.createMany.mock.calls[0][0].data).toHaveLength(2);
    expect(result.id).toBe('tx-1');
  });

  it('replays the same idempotency key without any write', async () => {
    tx.transaction.findUnique.mockResolvedValue({ ...transaction, deposit: deposit });

    const result = await service.confirmTransaction('dep-1', 'petugas-1', 'key-1');

    expect(result.id).toBe('tx-1');
    expect(tx.deposit.updateMany).not.toHaveBeenCalled();
    expect(tx.transaction.create).not.toHaveBeenCalled();
    expect(tx.transactionEvent.createMany).not.toHaveBeenCalled();
  });

  it('rejects a second confirmation with a different key instead of double-writing', async () => {
    tx.deposit.updateMany.mockResolvedValue({ count: 0 });
    await expect(service.confirmTransaction('dep-1', 'petugas-1', 'key-2')).rejects.toBeInstanceOf(ConflictException);
    expect(tx.transaction.create).not.toHaveBeenCalled();
    expect(tx.transactionEvent.createMany).not.toHaveBeenCalled();
  });

  it('rejects a key already used by another deposit', async () => {
    tx.transaction.findUnique.mockResolvedValue({ ...transaction, depositId: 'dep-2' });

    await expect(service.confirmTransaction('dep-1', 'petugas-1', 'key-1')).rejects.toBeInstanceOf(ConflictException);
    expect(tx.deposit.updateMany).not.toHaveBeenCalled();
  });

  it('reports an already confirmed deposit as a duplicate', async () => {
    prisma.deposit.findUnique.mockResolvedValue({ ...deposit, status: 'selesai' });
    tx.transaction.findUnique.mockResolvedValue({ id: 'tx-1' });

    await expect(service.confirmTransaction('dep-1', 'petugas-1', 'key-lain')).rejects.toBeInstanceOf(ConflictException);
    expect(tx.deposit.updateMany).not.toHaveBeenCalled();
  });

  it('rejects users outside the unit before touching the database transaction', async () => {
    unitAccess.assertStaffOfUnit.mockRejectedValue(new ForbiddenException());

    await expect(service.confirmTransaction('dep-1', 'nasabah-1', 'key-1')).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects confirmation before status Diproses', async () => {
    prisma.deposit.findUnique.mockResolvedValue({ ...deposit, status: 'menunggu' });

    await expect(service.confirmTransaction('dep-1', 'petugas-1', 'key-1')).rejects.toBeInstanceOf(ForbiddenException);
    expect(tx.transaction.create).not.toHaveBeenCalled();
  });
});
