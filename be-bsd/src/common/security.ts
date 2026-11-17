import type { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

// CORS hanya untuk origin FE (dipisah koma di CORS_ORIGINS).
export const ALLOWED_ORIGINS = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin !== '');

export function setupSecurity(app: INestApplication): void {
  // shortcut: CSP dimatikan karena Swagger UI memakai script/style inline; aktifkan lagi saat /docs hanya untuk dev.
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({ origin: ALLOWED_ORIGINS, credentials: true });
}
