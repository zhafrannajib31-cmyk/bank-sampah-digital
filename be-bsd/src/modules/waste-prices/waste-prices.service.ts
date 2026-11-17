import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateWastePriceDto } from './dto/create-waste-price.dto';
import { UpdateWastePriceDto } from './dto/update-waste-price.dto';

@Injectable()
export class WastePriceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string, categoryId?: string) {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    return this.prisma.wastePrice.findMany({
      where,
      orderBy: { effectiveFrom: 'desc' },
      select: {
        id: true,
        unitId: true,
        categoryId: true,
        pricePerKg: true,
        effectiveFrom: true,
        effectiveTo: true,
        status: true,
        isSimulated: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const price = await this.prisma.wastePrice.findUnique({
      where: { id },
      select: {
        id: true,
        unitId: true,
        categoryId: true,
        pricePerKg: true,
        effectiveFrom: true,
        effectiveTo: true,
        status: true,
        isSimulated: true,
        createdAt: true,
      },
    });
    if (!price) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Harga tidak ditemukan.' });
    }
    return price;
  }

  async create(dto: CreateWastePriceDto) {
    const existing = await this.prisma.wastePrice.findFirst({
      where: {
        categoryId: dto.categoryId,
        effectiveFrom: new Date(dto.effectiveFrom),
      },
    });
    if (existing) {
      throw new ConflictException({ code: 'CONFLICT', message: 'Harga untuk kategori dan tanggal sudah ada.' });
    }
    return this.prisma.wastePrice.create({
      data: {
        unitId: dto.unitId,
        categoryId: dto.categoryId,
        pricePerKg: parseFloat(dto.pricePerKg),
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
        status: dto.status ?? 'active',
        isSimulated: dto.isSimulated ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateWastePriceDto) {
    const existing = await this.prisma.wastePrice.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Harga tidak ditemukan.' });
    }
    return this.prisma.wastePrice.update({
      where: { id },
      data: {
        unitId: dto.unitId,
        categoryId: dto.categoryId,
        pricePerKg: dto.pricePerKg ? parseFloat(dto.pricePerKg) : undefined,
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : undefined,
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined,
        status: dto.status,
        isSimulated: dto.isSimulated,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.wastePrice.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Harga tidak ditemukan.' });
    }
    return this.prisma.wastePrice.delete({
      where: { id },
    });
  }
}
