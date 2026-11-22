import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { CurrentUser } from '../auth/guards/current-user.decorator';
import { CancelTransactionDto, CorrectTransactionDto } from './dto/transaction-action.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /** Nasabah: riwayat transaksi milik sendiri (dari token, bukan query). */
  @Get()
  @Roles('nasabah')
  async getTransactions(@CurrentUser('sub') customerId: string) {
    return this.transactionService.getTransactions(customerId);
  }

  /** Petugas: riwayat transaksi untuk unit yang ditugaskan (BSD-69). */
  @Get('petugas')
  @Roles('petugas')
  async getTransactionsByUnit(
    @Query('unitId', ParseUUIDPipe) unitId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.transactionService.getTransactionsByUnit(unitId, userId);
  }

  /** Nasabah: detail transaksi milik sendiri (dari token, bukan query). */
  @Get(':id')
  @Roles('nasabah')
  async getTransactionDetail(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') customerId: string,
  ) {
    return this.transactionService.getTransactionDetail(id, customerId);
  }

  /** Admin: batalkan transaksi Selesai dengan alasan (BSD-62). */
  @Post(':id/cancel')
  @Roles('admin')
  async cancelTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') adminId: string,
    @Body() dto: CancelTransactionDto,
  ) {
    return this.transactionService.cancelTransaction(id, adminId, dto.reason);
  }

  /** Admin: koreksi berat transaksi Selesai dengan alasan (BSD-62). */
  @Post(':id/correct')
  @Roles('admin')
  async correctTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') adminId: string,
    @Body() dto: CorrectTransactionDto,
  ) {
    return this.transactionService.correctTransaction(id, adminId, dto);
  }
}