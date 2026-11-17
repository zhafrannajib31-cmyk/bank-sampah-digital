import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production',
    });
  }

  async validate(payload: { sub: string; role: string; status: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, status: true, email: true, name: true },
    });
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException({
        message: 'Akun tidak ditemukan atau tidak aktif',
        code: 'ACCOUNT_INACTIVE',
      });
    }
    return { sub: user.id, email: user.email, name: user.name, role: user.role, status: user.status };
  }
}