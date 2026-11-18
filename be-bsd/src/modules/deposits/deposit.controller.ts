import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';

@ApiTags('deposits')
@Controller('deposits')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  @ApiOperation({ summary: 'Buat pengajuan setoran baru (nasabah)' })
  @ApiResponse({ status: 201, description: 'Pengajuan dibuat' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak: role nasabah diperlukan' })
  @UseGuards(RoleGuard)
  @Roles('nasabah')
  async create(
    @Body() dto: CreateDepositDto,
    @Req() req: any,
  ) {
    const customerId = req.user?.sub;
    if (!customerId) {
      throw new Error('Customer ID not found in token');
    }
    return this.depositService.create(dto, customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat status pengajuan (nasabah sendiri)' })
  @ApiResponse({ status: 200, description: 'Status pengajuan' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  @UseGuards(RoleGuard)
  @Roles('nasabah')
  async get(@Param('id') id: string, @Req() req: any) {
    const customerId = req.user?.sub;
    if (!customerId) {
      throw new Error('Customer ID not found in token');
    }
    return this.depositService.getDeposit(id, customerId);
  }

  @Patch(':id/batal')
  @ApiOperation({ summary: 'Batalkan pengajuan (nasabah, status Menunggu)' })
  @ApiResponse({ status: 200, description: 'Pengajuan dibatalkan' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  @UseGuards(RoleGuard)
  @Roles('nasabah')
  async cancel(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { reason: string },
  ) {
    const customerId = req.user?.sub;
    if (!customerId) {
      throw new Error('Customer ID not found in token');
    }
    return this.depositService.cancelDeposit(id, customerId, body.reason);
  }
}
