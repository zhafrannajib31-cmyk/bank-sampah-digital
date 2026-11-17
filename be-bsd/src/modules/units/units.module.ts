import { Module } from '@nestjs/common';
import { UnitController } from './units.controller';
import { UnitService } from './units.service';

@Module({
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService],
})
export class UnitModule {}
