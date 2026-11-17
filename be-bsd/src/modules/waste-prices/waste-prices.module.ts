import { Module } from '@nestjs/common';
import { WastePriceController } from './waste-prices.controller';
import { WastePriceService } from './waste-prices.service';

@Module({
  controllers: [WastePriceController],
  providers: [WastePriceService],
  exports: [WastePriceService],
})
export class WastePriceModule {}
