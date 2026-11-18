import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { createObserveModule } from '@nestjs/observe';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { appValidationPipe } from './common/validation';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { UnitModule } from './modules/units/units.module';
import { WasteCategoryModule } from './modules/waste-categories/waste-categories.module';
import { WastePriceModule } from './modules/waste-prices/waste-prices.module';
import { DepositModule } from './modules/deposits/deposit.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RoleGuard } from './common/guards/roles.guard';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'be-bsd',
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 100 }],
      errorMessage: 'Terlalu banyak permintaan, coba lagi nanti.',
    }),
    AuthModule,
    UserModule,
    UnitModule,
    WasteCategoryModule,
    WastePriceModule,
    DepositModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useValue: appValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: RoleGuard, useClass: RoleGuard },
  ],
})
export class AppModule {}
