import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UnitAccessService } from './services/unit-access.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [UnitAccessService],
  exports: [UnitAccessService],
})
export class CommonModule {}