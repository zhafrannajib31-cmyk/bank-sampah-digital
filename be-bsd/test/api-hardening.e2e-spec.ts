import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupSecurity } from './../src/common/security';
import { setupSwagger } from './../src/common/swagger';

describe('Keamanan dan dokumentasi API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupSecurity(app);
    setupSwagger(app);
    await app.init();
  });

  it('menyajikan dokumen OpenAPI di /docs-json', async () => {
    const response = await request(app.getHttpServer()).get('/docs-json').expect(200);

    expect(response.body.info.title).toBe('Bank Sampah Digital API');
  });

  it('mengizinkan origin FE dan menolak origin lain', async () => {
    const allowed = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://localhost:3000')
      .expect(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:3000');

    const blocked = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://evil.example')
      .expect(200);
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('mengirim header keamanan', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('membatasi jumlah permintaan per IP', async () => {
    let lastStatus = 200;
    for (let i = 0; i < 105 && lastStatus !== 429; i += 1) {
      lastStatus = (await request(app.getHttpServer()).get('/health')).status;
    }

    expect(lastStatus).toBe(429);
  }, 20_000);

  afterAll(async () => {
    await app.close();
  });
});
