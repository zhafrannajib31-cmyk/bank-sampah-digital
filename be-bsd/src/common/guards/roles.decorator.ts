import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Dekorator untuk mendeklarasikan role role yang diperlukan oleh route/controller.
 * Contoh:
 *   @UseGuards(RoleGuard)
 *   @Roles('admin', 'petugas')
 *   @Get('units')
 *   async getUnits() {}
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
