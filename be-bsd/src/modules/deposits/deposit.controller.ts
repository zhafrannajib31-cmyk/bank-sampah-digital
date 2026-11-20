import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';

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

  @Get()
  @ApiOperation({ summary: 'Daftar pengajuan milik nasabah (terbaru dulu)' })
  @ApiResponse({ status: 200, description: 'Daftar pengajuan' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @UseGuards(RoleGuard)
  @Roles('nasabah')
  async list(@Req() req: any) {
    const customerId = req.user?.sub;
    if (!customerId) {
      throw new Error('Customer ID not found in token');
    }
    return this.depositService.listDeposits(customerId);
  }

  // Didaftarkan sebelum `:id` agar "petugas" tidak tertangkap sebagai id.
  @Get('petugas')
  @ApiOperation({ summary: 'Daftar pengajuan unit petugas (terbaru dulu)' })
  @ApiResponse({ status: 200, description: 'Daftar pengajuan unit sendiri' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak: role petugas diperlukan' })
  @UseGuards(RoleGuard)
  @Roles('petugas')
  async listForUnit(@Req() req: any, @Query('status') status?: string) {
    const petugasId = req.user?.sub;
    if (!petugasId) {
      throw new Error('Petugas ID not found in token');
    }
    return this.depositService.listUnitDeposits(petugasId, status);
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

  // E8: petugas endpoints

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status (petugas, Menunggu -> Diproses)' })
  @ApiResponse({ status: 200, description: 'Status diupdate' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak: role petugas diperlukan' })
  @UseGuards(RoleGuard)
  @Roles('petugas')
  async updateStatus(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const petugasId = req.user?.sub;
    if (!petugasId) {
      throw new Error('Petugas ID not found in token');
    }
    return this.depositService.updateStatus(id, petugasId, 'diproses');
  }

  @Patch(':id/weight')
  @ApiOperation({ summary: 'Input berat aktual (petugas)' })
  @ApiResponse({ status: 200, description: 'Berat diupdate' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  @UseGuards(RoleGuard)
  @Roles('petugas')
  async updateWeight(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: UpdateWeightDto,
  ) {
    const petugasId = req.user?.sub;
    if (!petugasId) {
      throw new Error('Petugas ID not found in token');
    }
    return this.depositService.updateWeight(id, petugasId, body.items);
  }

  @Patch(':id/snapshoot')
  @ApiOperation({ summary: 'Snapshot harga (petugas)' })
  @ApiResponse({ status: 200, description: 'Harga di-snapshot' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  @UseGuards(RoleGuard)
  @Roles('petugas')
  async snapshotPrice(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { items: { categoryId: string; unitPriceSnapshot: string }[] },
  ) {
    const petugasId = req.user?.sub;
    if (!petugasId) {
      throw new Error('Petugas ID not found in token');
    }
    return this.depositService.snapshotPrice(id, petugasId, body.items);
  }

  @Post(':id/value')
  @ApiOperation({ summary: 'Hitung nilai (petugas)' })
  @ApiResponse({ status: 200, description: 'Nilai dihitung' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  @UseGuards(RoleGuard)
  @Roles('petugas')
  async calculateValue(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const petugasId = req.user?.sub;
    if (!petugasId) {
      throw new Error('Petugas ID not found in token');
    }
    return this.depositService.calculateValue(id, petugasId);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Konfirmasi transaksi (petugas, atomik+idempotent)' })
  @ApiResponse({ status: 200, description: 'Transaksi dikonfirmasi' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  @UseGuards(RoleGuard)
  @Roles('petugas')
  async confirm(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { idempotencyKey: string },
  ) {
    const petugasId = req.user?.sub;
    if (!petugasId) {
      throw new Error('Petugas ID not found in token');
    }
    return this.depositService.confirmTransaction(id, petugasId, body.idempotencyKey);
  }
}
