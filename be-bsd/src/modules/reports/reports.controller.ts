import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { CurrentUser } from '../auth/guards/current-user.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Ringkasan dashboard harian untuk petugas (BSD-70).
   * Hanya petugas yang ditugaskan ke unit tertentu yang bisa melihat ringkasan ini.
   */
  @Get('petugas/:unitId')
  @Roles('petugas')
  async getDailySummary(
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.reportsService.getDailySummary(unitId, userId);
  }
}