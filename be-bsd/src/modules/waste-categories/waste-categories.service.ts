import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateWasteCategoryDto } from './dto/create-waste-category.dto';
import { UpdateWasteCategoryDto } from './dto/update-waste-category.dto';

@Injectable()
export class WasteCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    return this.prisma.wasteCategory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.wasteCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });
    if (!category) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Kategori tidak ditemukan.' });
    }
    return category;
  }

  async create(dto: CreateWasteCategoryDto) {
    const existing = await this.prisma.wasteCategory.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException({ code: 'CONFLICT', message: 'Nama kategori sudah ada.' });
    }
    return this.prisma.wasteCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status ?? 'active',
      },
    });
  }

  async update(id: string, dto: UpdateWasteCategoryDto) {
    const existing = await this.prisma.wasteCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Kategori tidak ditemukan.' });
    }
    return this.prisma.wasteCategory.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.wasteCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Kategori tidak ditemukan.' });
    }
    return this.prisma.wasteCategory.delete({
      where: { id },
    });
  }
}
