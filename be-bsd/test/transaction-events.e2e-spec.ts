import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/common/prisma.service';
import { UnitAccessService } from '../src/common/services/unit-access.service';
import { WastePriceService } from '../src/modules/waste-prices/waste-prices.service';
import { DepositService } from '../src/modules/deposits/deposit.service';

describe('transaction_events pada perubahan status (BSD-61)', () => {
  let tx: any;
  let prisma: any;
  let service: DepositService;

  beforeEach(async () => {
    tx = {
      deposit: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn().mockResolvedValue({ id: 'dep-1', status: 'dibatalkan', items: [] }),
      },
      transactionEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    prisma = {
      deposit: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'dep-1',
          unitId: 'unit-1',
          customerId: 'cust-1',
          status: 'menunggu',
          items: [],
        }),
      },
      $transaction: jest.fn(async (callback: (t: any) => unknown) => callback(tx)),
      transactionEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    const module = await Test.createTestingModule({
      providers: [
        DepositService,
        { provide: PrismaService, useValue: prisma },
        { provide: UnitAccessService, useValue: { assertStaffOfUnit: jest.fn() } },
        { provide: WastePriceService, useValue: {} },
      ],
    }).compile();
    service = module.get(DepositService);
  });

  it('pembatalan Menunggu mencatat status lama, baru, pelaku, alasan, dan waktu', async () => {
    await service.cancelDeposit('dep-1', 'cust-1', 'Tidak jadi setor');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.deposit.updateMany).toHaveBeenCalledWith({
      where: { id: 'dep-1', status: 'menunggu' },
      data: expect.objectContaining({ status: 'dibatalkan', cancellationReason: 'Tidak jadi setor' }),
    });
    expect(tx.transactionEvent.create).toHaveBeenCalledTimes(1);
    expect(tx.transactionEvent.create.mock.calls[0][0].data).toMatchObject({
      depositId: 'dep-1',
      eventType: 'CANCELLED',
      oldStatus: 'menunggu',
      newStatus: 'dibatalkan',
      actorId: 'cust-1',
      reason: 'Tidak jadi setor',
    });
    expect(tx.transactionEvent.create.mock.calls[0][0].data.createdAt).toBeUndefined();
  });

  it('pembatalan pasca-konfirmasi mencatat alasan di kolom reason, bukan metadata', async () => {
    prisma.deposit.findUnique.mockResolvedValue({
      id: 'dep-1',
      unitId: 'unit-1',
      customerId: 'cust-1',
      status: 'selesai',
      items: [],
    });

    await service.cancelConfirmed('dep-1', 'cust-1', 'Data timbangan salah');

    expect(tx.deposit.updateMany).toHaveBeenCalledWith({
      where: { id: 'dep-1', status: 'selesai' },
      data: expect.objectContaining({ status: 'dibatalkan' }),
    });
    expect(tx.transactionEvent.create.mock.calls[0][0].data).toMatchObject({
      eventType: 'CANCELLED_AFTER_CONFIRMATION',
      oldStatus: 'selesai',
      newStatus: 'dibatalkan',
      actorId: 'cust-1',
      reason: 'Data timbangan salah',
    });
  });

  it('transisi Menunggu → Diproses mencatat pelaku petugas', async () => {
    await service.updateStatus('dep-1', 'petugas-1', 'diproses');

    expect(tx.transactionEvent.create.mock.calls[0][0].data).toMatchObject({
      eventType: 'STATUS_UPDATE',
      oldStatus: 'menunggu',
      newStatus: 'diproses',
      actorId: 'petugas-1',
    });
  });
});
