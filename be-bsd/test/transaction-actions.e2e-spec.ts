import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Decimal } from '@prisma/client-runtime-utils';
import { PrismaService } from '../src/common/prisma.service';
import { UnitAccessService } from '../src/common/services/unit-access.service';
import { TransactionService } from '../src/modules/transactions/transaction.service';
import { CancelTransactionDto, CorrectTransactionDto } from '../src/modules/transactions/dto/transaction-action.dto';

const deposit = {
  id: 'dep-1',
  customerId: 'cust-1',
  status: 'selesai',
  items: [{ id: 'item-1', categoryId: 'cat-1', actualWeight: new Decimal('2.250'), unitPriceSnapshot: new Decimal('4000.00') }],
};

const transaction = {
  id: 'tx-1',
  depositId: 'dep-1',
  customerId: 'cust-1',
  unitId: 'unit-1',
  totalWeight: new Decimal('2.250'),
  totalValue: new Decimal('9000.00'),
  confirmedBy: 'petugas-1',
  confirmedAt: new Date(),
  createdAt: new Date(),
  status: 'active',
  deposit,
};

describe('Pembatalan dan koreksi pasca-konfirmasi (BSD-62)', () => {
  let tx: any;
  let prisma: any;
  let service: TransactionService;

  beforeEach(async () => {
    tx = {
      transaction: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalValue: new Decimal('12000.00') } }),
      },
      deposit: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      depositItem: { update: jest.fn().mockResolvedValue({}) },
      transactionEvent: { create: jest.fn().mockResolvedValue({}) },
      user: { update: jest.fn().mockResolvedValue({}) },
    };
    prisma = {
      transaction: { findUnique: jest.fn().mockResolvedValue({ ...transaction }) },
      user: { findUnique: jest.fn().mockResolvedValue({ saldo: new Decimal('12000.00') }) },
      $transaction: jest.fn(async (callback: (t: any) => unknown) => callback(tx)),
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

  it('mewajibkan alasan pada DTO pembatalan', async () => {
    const errors = await validate(plainToInstance(CancelTransactionDto, { reason: '   ' }));
    expect(errors.some((error) => error.property === 'reason')).toBe(true);
  });

  it('mewajibkan alasan dan minimal satu item pada DTO koreksi', async () => {
    const errors = await validate(plainToInstance(CorrectTransactionDto, { reason: '', items: [] }));
    expect(errors.map((error) => error.property)).toEqual(expect.arrayContaining(['reason', 'items']));
  });

  it('pembatalan mengubah status, menulis event, dan memperbarui saldo sekali', async () => {
    await service.cancelTransaction('tx-1', 'admin-1', 'Salah input berat');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.transaction.updateMany).toHaveBeenCalledWith({
      where: { id: 'tx-1', status: 'active' },
      data: { status: 'cancelled' },
    });
    expect(tx.deposit.updateMany).toHaveBeenCalledWith({
      where: { id: 'dep-1', status: 'selesai' },
      data: expect.objectContaining({ status: 'dibatalkan', cancellationReason: 'Salah input berat' }),
    });
    expect(tx.transactionEvent.create.mock.calls[0][0].data).toMatchObject({
      transactionId: 'tx-1',
      eventType: 'CANCELLED_AFTER_CONFIRMATION',
      oldStatus: 'active',
      newStatus: 'cancelled',
      actorId: 'admin-1',
      reason: 'Salah input berat',
    });
    expect(tx.transaction.aggregate).toHaveBeenCalledTimes(1);
    expect(tx.user.update).toHaveBeenCalledTimes(1);
    expect(tx.user.update.mock.calls[0][0].data.saldo.toFixed(2)).toBe('12000.00');
  });

  it('pembatalan ulang ditolak 409 tanpa menulis event atau saldo', async () => {
    tx.transaction.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.cancelTransaction('tx-1', 'admin-1', 'Alasan')).rejects.toBeInstanceOf(ConflictException);
    expect(tx.transactionEvent.create).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
  });

  it('koreksi menghitung ulang nilai Decimal, menyimpan nilai lama di event, dan memperbarui saldo sekali', async () => {
    await service.correctTransaction('tx-1', 'admin-1', {
      reason: 'Berat ditimbang ulang',
      items: [{ itemId: 'item-1', actualWeight: '3.000' }],
    });

    expect(tx.transaction.updateMany.mock.calls[0][0].data.totalValue.toFixed(2)).toBe('12000.00');
    expect(tx.depositItem.update.mock.calls[0][0].data).toMatchObject({
      actualWeight: expect.any(Decimal),
      lineTotal: expect.any(Decimal),
    });
    expect(tx.depositItem.update.mock.calls[0][0].data.lineTotal.toFixed(2)).toBe('12000.00');
    expect(tx.transactionEvent.create.mock.calls[0][0].data).toMatchObject({
      eventType: 'CORRECTION',
      actorId: 'admin-1',
      reason: 'Berat ditimbang ulang',
      metadata: expect.objectContaining({ previousTotalValue: '9000.00', totalValue: '12000.00' }),
    });
    expect(tx.transaction.aggregate).toHaveBeenCalledTimes(1);
    expect(tx.user.update).toHaveBeenCalledTimes(1);
  });

  it('koreksi menolak item yang bukan milik transaksi', async () => {
    await expect(service.correctTransaction('tx-1', 'admin-1', {
      reason: 'Salah item',
      items: [{ itemId: 'item-asing', actualWeight: '1.000' }],
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('koreksi ulang ditolak 409 tanpa menulis event atau saldo', async () => {
    tx.transaction.updateMany.mockResolvedValue({ count: 0 });

    await expect(service.correctTransaction('tx-1', 'admin-1', {
      reason: 'Diulang',
      items: [{ itemId: 'item-1', actualWeight: '3.000' }],
    })).rejects.toBeInstanceOf(ConflictException);
    expect(tx.transactionEvent.create).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
  });
});
