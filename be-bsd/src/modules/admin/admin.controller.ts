import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class AdminController {
  @Get()
  getAdminDashboard(@Req() req: any) {
    const user = req.user as any;
    return {
      ok: true,
      message: 'Selamat datang di dashboard admin',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
