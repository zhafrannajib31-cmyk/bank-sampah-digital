import { validate } from 'class-validator';
import { QueryUnitsDto } from './dto/query-units.dto';
import { UnitService } from './units.service';

jest.mock('../../common/prisma.service', () => ({ PrismaService: class {} }));

describe('pencarian dan filter unit (BSD-45)', () => {
  const findMany = jest.fn().mockResolvedValue([]);
  const service = new UnitService({ bankSampahUnit: { findMany } } as never);

  beforeEach(() => findMany.mockClear());

  it('mencari nama/alamat, area, dan status layanan sekaligus', async () => {
    await service.findAll('Cibeunying', 'Bandung', undefined, 'open');

    expect(findMany.mock.calls[0][0].where).toEqual({
      serviceStatus: 'open',
      OR: [
        { name: { contains: 'Cibeunying', mode: 'insensitive' } },
        { address: { contains: 'Cibeunying', mode: 'insensitive' } },
      ],
      address: { contains: 'Bandung', mode: 'insensitive' },
    });
  });

  it('mengabaikan kata kunci kosong', async () => {
    await service.findAll('   ', '', undefined, undefined);

    expect(findMany.mock.calls[0][0].where).toEqual({});
  });

  it('menolak status layanan di luar enum dengan pesan bahasa Indonesia', async () => {
    const dto = Object.assign(new QueryUnitsDto(), { serviceStatus: 'tutup' });
    const errors = await validate(dto);

    expect(errors.map((error) => Object.values(error.constraints ?? {})).flat()).toContain(
      'serviceStatus harus open, closed, atau temporarily_closed.',
    );
  });
});
