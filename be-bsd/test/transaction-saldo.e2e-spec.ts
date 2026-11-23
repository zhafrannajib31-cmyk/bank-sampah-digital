import { Test } from '@nestjs/testing';
import { Decimal } from '@prisma/client-runtime-utils';
import { ROLES_KEY } from '../src/common/guards/roles.decorator';
import { PrismaService } from '../src/common/prisma.service';
import { UnitAccessService } from '../src/common/services/unit-access.service';
import { TransactionController } from '../src/modules/transactions/transaction.controller';
import { TransactionService } from '../src/modules/transactions/transaction.service';

describe('Saldo/nilai akumulatif nasabah (BSD-66)', () => {
  let prisma: any;
  let service: TransactionService;

  beforeEach(async () => {
    prisma = {
      transaction: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalValue: new Decimal('30000.00') } }),
      },
      user: { update: jest.fn() },
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

  it('menjumlah transaksi aktif dan terkoreksi milik nasabah yang bersangkutan', async () => {
    const result = await service.getSaldo('cust-1');

    expect(prisma.transaction.aggregate).toHaveBeenCalledWith({
      where: { customerId: 'cust-1', status: { in: ['active', 'corrected'] } },
      _sum: { totalValue: true },
    });
    expect(result.saldo.toFixed(2)).toBe('30000.00');
    expect(result.keterangan).toBe('Catatan nilai setoran, bukan dana yang dapat ditarik.');
  });

  it('mengembalikan nol tanpa transaksi dan tidak pernah menulis saldo saat dibaca', async () => {
    prisma.transaction.aggregate.mockResolvedValue({ _sum: { totalValue: null } });

    const first = await service.getSaldo('cust-2');
    const second = await service.getSaldo('cust-2');

    expect(first.saldo.toFixed(2)).toBe('0.00');
    expect(second.saldo.toFixed(2)).toBe('0.00');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rute saldo hanya untuk nasabah', () => {
    const route = Object.getOwnPropertyDescriptor(TransactionController.prototype, 'getSaldo')?.value;
    expect(Reflect.getMetadata(ROLES_KEY, route)).toEqual(['nasabah']);
  });
});
