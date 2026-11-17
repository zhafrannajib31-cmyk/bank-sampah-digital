import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { setupSecurity } from './common/security';
import { setupSwagger } from './common/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  setupSecurity(app);
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
