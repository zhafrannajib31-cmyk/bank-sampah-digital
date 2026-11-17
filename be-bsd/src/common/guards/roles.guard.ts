import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/**
 * RoleGuard membandingkan role yang diperlukan (@Roles) dengan role pengguna
 * yang sedang login (dari request.user.role, di-set oleh JwtStrategy).
 *
 * - Jika tidak ada role yang dibatasi, akses diizinkan.
 * - Jika role pengguna cocok, akses diizinkan.
 * - Jika tidak cocok, akses ditolak.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user ?? request.currentUser;

    if (!user || typeof user.role !== 'string' || user.role.trim() === '') {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Akses ditolak: role pengguna tidak ditemukan.',
        code: 'FORBIDDEN',
      });
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Akses ditolak: role Anda tidak memiliki izin untuk akses ini.',
        code: 'FORBIDDEN',
      });
    }

    return true;
  }
}
