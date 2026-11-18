import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class DepositService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDepositDto, customerId: string) {
    // 1. Check unit existence + publication status
    const unit = await this.prisma.bankSampahUnit.findUnique({
      where: { id: dto.unitId },
    });
    if (!unit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Unit tidak ditemukan.' });
    }
    if (unit.publicationStatus !== 'published') {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Unit ini tidak tersedia.' });
    }

    // 2. Create deposit
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

    // 3. Authorization: nasabah hanya melihat data miliknya
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
        inspectionStatus: item.inspectionStatus,
        rejectionReason: item.rejectionReason,
        createdAt: item.createdAt,
      })),
    };
  }
}
