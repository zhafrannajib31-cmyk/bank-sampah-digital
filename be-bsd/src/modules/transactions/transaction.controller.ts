import { Controller, Get, Query, Param, ParseUUIDPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @Roles('nasabah')
  async getTransactions(@Query('customerId') customerId: string) {
    if (!customerId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Customer ID diperlukan.' });
    }
    return this.transactionService.getTransactions(customerId);
  }

  /** Petugas: riwayat transaksi untuk unit yang ditugaskan (BSD-69). */
  @Get('petugas')
  @Roles('petugas')
  async getTransactionsByUnit(
    @Query('unitId', ParseUUIDPipe) unitId: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.transactionService.getTransactionsByUnit(unitId, userId);
  }

  @Get(':id')
  @Roles('nasabah')
  async getTransactionDetail(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('customerId') customerId: string,
  ) {
    if (!customerId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Customer ID diperlukan.' });
    }
    return this.transactionService.getTransactionDetail(id, customerId);
  }
}
