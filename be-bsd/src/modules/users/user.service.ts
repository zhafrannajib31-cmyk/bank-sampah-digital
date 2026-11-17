import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { UserRole, type UserStatus } from '../../../generated/prisma/client';

export type UserRoleValue = UserRole;

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  unitId?: string;
}

export interface ToggleStatusDto {
  status: 'active' | 'inactive';
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(role?: string, status?: string) {
    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (status) where.status = status;
    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        unitStaffs: {
          select: { unitId: true, status: true },
        },
      },
    });
  }

  /** Konversi string role (dari DTO) menjadi UserRole enum. */
  private mapRole(role: string): UserRole {
    switch (role) {
      case 'nasabah':
        return UserRole.nasabah;
      case 'petugas':
        return UserRole.petugas;
      case 'admin':
        return UserRole.admin;
      default:
        return UserRole.petugas;
    }
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });
    if (existing) {
      throw new ConflictException({
        code: 'DUPLICATE_CREDENTIALS',
        message: 'Email atau telepon sudah terdaftar.',
      });
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        passwordHash: dto.password,
        role: dto.role ? this.mapRole(dto.role) : UserRole.petugas,
      },
    });

    if (dto.unitId) {
      await this.prisma.unitStaff.create({
        data: {
          userId: user.id,
          unitId: dto.unitId,
          status: 'active',
        },
      });
    }

    return user;
  }

  async toggleStatus(userId: string, status: 'active' | 'inactive') {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existing) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Pengguna tidak ditemukan.',
      });
    }
    if (existing.id === userId) {
      throw new BadRequestException({
        code: 'CANNOT_MODIFY_SELF',
        message: 'Tidak dapat mengubah status akun sendiri.',
      });
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status as UserStatus },
    });
  }
}
