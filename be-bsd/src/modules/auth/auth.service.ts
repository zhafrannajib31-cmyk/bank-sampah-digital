import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../../common/prisma.service';
import type { UserRole, UserStatus } from '../../../generated/prisma/client';

const ACCESS_TTL = '15m';
const REFRESH_TTL_DAYS = 7;
const REFRESH_TTL_SECONDS = REFRESH_TTL_DAYS * 24 * 60 * 60;
const RESET_TTL_SECONDS = 30 * 60;
const SCRYPT_KEYLEN = 64;

function hashPassword(password: string, salt: string): string {
  return `scrypt$${salt}$${scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, keyHex] = parts;
  const computed = scryptSync(password, salt, SCRYPT_KEYLEN);
  const stored = Buffer.from(keyHex, 'hex');
  return timingSafeEqual(computed, stored);
}

function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

function generateRefreshToken(): string {
  return randomBytes(32).toString('hex');
}

function hashRefreshToken(token: string): string {
  return scryptSync(token, 'refresh-salt', 32).toString('hex');
}

function hashResetToken(token: string): string {
  return scryptSync(token, 'reset-salt', 32).toString('hex');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: { name: string; email: string; phone?: string; password: string }) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])] },
      select: { email: true, phone: true },
    });
    if (existing) {
      throw new ConflictException({
        message: 'Email atau nomor telepon sudah terdaftar',
        code: 'DUPLICATE_CREDENTIALS',
      });
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? null,
        passwordHash,
        role: 'nasabah',
        status: 'active',
      },
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
    });

    const tokens = await this.issueTokens(user.id, user.role, user.status);
    return { user, ...tokens };
  }

  async login(dto: { email: string; phone?: string; password: string }) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])] },
    });
    if (!user || !verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException({
        message: 'Email/telepon atau kata sandi salah',
        code: 'INVALID_CREDENTIALS',
      });
    }
    if (user.status !== 'active') {
      throw new UnauthorizedException({
        message: 'Akun tidak aktif. Hubungi administrator.',
        code: 'ACCOUNT_INACTIVE',
      });
    }

    const tokens = await this.issueTokens(user.id, user.role, user.status);
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, status: true },
    });
    if (user && user.status === 'active') {
      const token = randomBytes(32).toString('hex');
      await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      await this.prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash: hashResetToken(token), expiresAt: new Date(Date.now() + RESET_TTL_SECONDS * 1000) },
      });
    }
    // Respons sama untuk email terdaftar maupun tidak, agar akun tidak bisa ditebak.
    return { sent: true };
  }

  async resetPassword(token: string, password: string) {
    const stored = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash: hashResetToken(token) }, include: { user: true } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.passwordResetToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException({ message: 'Token reset tidak valid atau kedaluwarsa', code: 'INVALID_RESET_TOKEN' });
    }
    await this.prisma.passwordResetToken.delete({ where: { id: stored.id } });
    const user = stored.user;
    if (user.status !== 'active') {
      throw new UnauthorizedException({ message: 'Akun tidak aktif', code: 'ACCOUNT_INACTIVE' });
    }
    const salt = generateSalt();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(password, salt) },
    });
    // Reset kata sandi mengakhiri sesi lama (invalidate refresh token).
    await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    return { reset: true };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const hash = hashRefreshToken(refreshToken);
      await this.prisma.refreshToken.deleteMany({ where: { userId, tokenHash: hash } });
    }
    return { message: 'Berhasil logout' };
  }

  async refresh(refreshToken: string) {
    const hash = hashRefreshToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException({
        message: 'Refresh token tidak valid atau kedaluwarsa',
        code: 'INVALID_REFRESH_TOKEN',
      });
    }
    if (stored.user.status !== 'active') {
      await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException({
        message: 'Akun tidak aktif',
        code: 'ACCOUNT_INACTIVE',
      });
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = await this.issueTokens(stored.user.id, stored.user.role, stored.user.status);
    return tokens;
  }

  /** Profil lengkap pengguna (digunakan /auth/me). */
  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  /** Perbarui profil nasabah: nama, email, nomor telepon. */
  async updateProfile(userId: string, data: { name?: string; email?: string; phone?: string }) {
    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: { id: { not: userId }, email: data.email.toLowerCase() },
      });
      if (existing) {
        throw new ConflictException({
          message: 'Email sudah terdaftar',
          code: 'DUPLICATE_CREDENTIALS',
        });
      }
    }
    if (data.phone) {
      const existing = await this.prisma.user.findFirst({
        where: { id: { not: userId }, phone: data.phone },
      });
      if (existing) {
        throw new ConflictException({
          message: 'Nomor telepon sudah terdaftar',
          code: 'DUPLICATE_CREDENTIALS',
        });
      }
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email?.toLowerCase(),
        phone: data.phone ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        saldo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  private async issueTokens(userId: string, role: UserRole, status: UserStatus) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, role, status },
      { expiresIn: ACCESS_TTL },
    );
    const refreshToken = generateRefreshToken();
    const refreshHash = hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TTL_SECONDS * 1000);

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: refreshHash, expiresAt },
    });

    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }
}