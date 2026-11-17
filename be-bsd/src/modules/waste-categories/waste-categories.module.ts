import { Module } from '@nestjs/common';
import { WasteCategoryController } from './waste-categories.controller';
import { WasteCategoryService } from './waste-categories.service';

@Module({
  controllers: [WasteCategoryController],
  providers: [WasteCategoryService],
  exports: [WasteCategoryService],
})
export class WasteCategoryModule {}
