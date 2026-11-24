import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    search?: string,
    area?: string,
    publicationStatus?: string,
    serviceStatus?: string,
  ) {
    const where: Record<string, unknown> = {};

    if (publicationStatus) where.publicationStatus = publicationStatus;
    if (serviceStatus) where.serviceStatus = serviceStatus;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (area) {
      where.address = { contains: area, mode: 'insensitive' };
    }

    return this.prisma.bankSampahUnit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        prices: {
          where: { status: 'active' },
          select: {
            categoryId: true,
            pricePerKg: true,
            effectiveFrom: true,
            effectiveTo: true,
            unitId: true,
            category: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const unit = await this.prisma.bankSampahUnit.findUnique({
      where: { id },
      include: {
        prices: {
          where: { status: 'active' },
          select: {
            categoryId: true,
            pricePerKg: true,
            effectiveFrom: true,
            effectiveTo: true,
            unitId: true,
            category: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });
    if (!unit) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Unit tidak ditemukan.' });
    }
    return unit;
  }

  async create(dto: CreateUnitDto) {
    // Check duplicates based on name + simulation flag
    const existing = await this.prisma.bankSampahUnit.findFirst({
      where: { isSimulated: true, name: dto.name },
    });
    if (existing) {
      throw new ConflictException({ code: 'CONFLICT', message: 'Nama unit sudah terdaftar.' });
    }
    return this.prisma.bankSampahUnit.create({
      data: {
        name: dto.name,
        address: dto.address ?? '',
        latitude: dto.latitude ? parseFloat(dto.latitude) : undefined,
        longitude: dto.longitude ? parseFloat(dto.longitude) : undefined,
        operatingHours: dto.operatingHours,
        contactPhone: dto.contactPhone,
        contactEmail: dto.contactEmail,
        serviceStatus: dto.serviceStatus ?? 'open',
        publicationStatus: dto.publicationStatus ?? 'draft',
        isSimulated: dto.isSimulated ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateUnitDto) {
    const existing = await this.prisma.bankSampahUnit.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Unit tidak ditemukan.' });
    }
    return this.prisma.bankSampahUnit.update({
      where: { id },
      data: {
        name: dto.name,
        address: dto.address ?? existing.address,
        latitude: dto.latitude !== undefined ? parseFloat(dto.latitude) : (existing.latitude as any),
        longitude: dto.longitude !== undefined ? parseFloat(dto.longitude) : (existing.longitude as any),
        operatingHours: (dto.operatingHours ?? (existing.operatingHours as any)),
        contactPhone: dto.contactPhone ?? existing.contactPhone,
        contactEmail: dto.contactEmail ?? existing.contactEmail,
        serviceStatus: dto.serviceStatus ?? existing.serviceStatus,
        publicationStatus: dto.publicationStatus ?? existing.publicationStatus,
        isSimulated: dto.isSimulated ?? existing.isSimulated,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.bankSampahUnit.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Unit tidak ditemukan.' });
    }
    return this.prisma.bankSampahUnit.delete({
      where: { id },
    });
  }

  async findDistance(lat: number, lng: number) {
    const units = await this.prisma.bankSampahUnit.findMany({
      where: {
        publicationStatus: 'published',
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return units.map((u) => {
      if (!u.latitude || !u.longitude) {
        return { ...u, distanceKm: null, note: 'Koordinat belum diisi' };
      }
      const latNum = (u.latitude as any).toNumber();
      const lngNum = (u.longitude as any).toNumber();
      const R = 6371;
      const dLat = ((lat - latNum) * Math.PI) / 180;
      const dLng = ((lng - lngNum) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((latNum * Math.PI) / 180) *
          Math.cos((lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return { ...u, distanceKm: +(R * c).toFixed(2) };
    });
  }
}
