import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupSecurity } from './../src/common/security';
import { setupSwagger } from './../src/common/swagger';
import { PrismaService } from './../src/common/prisma.service';
import { scryptSync } from 'node:crypto';

function hashPassword(password: string, salt: string): string {
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
}

describe('Auth API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const TEST_PASSWORD = 'TestPass123!';
  const TEST_SALT = 'test-salt-e2e';
  const tokens: { accessToken?: string; refreshToken?: string } = {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupSecurity(app);
    setupSwagger(app);
    await app.init();

    prisma = app.get(PrismaService);

    for (const email of ['e2e-login@contoh.test', 'e2e-inactive@contoh.test', 'e2e-dup@contoh.test', 'e2e-dup2@contoh.test', 'e2e-petugas@contoh.test', 'e2e-admin@contoh.test']) {
      await prisma.user.deleteMany({ where: { email } });
    }
    await prisma.user.create({
      data: {
        name: 'E2E Login User',
        email: 'e2e-login@contoh.test',
        passwordHash: hashPassword(TEST_PASSWORD, TEST_SALT),
        role: 'nasabah',
        status: 'active',
      },
    });
    await prisma.user.create({
      data: {
        name: 'E2E Inactive User',
        email: 'e2e-inactive@contoh.test',
        passwordHash: hashPassword(TEST_PASSWORD, TEST_SALT),
        role: 'nasabah',
        status: 'inactive',
      },
    });
    await prisma.user.create({
      data: {
        name: 'E2E Dup Email User',
        email: 'e2e-dup@contoh.test',
        passwordHash: hashPassword(TEST_PASSWORD, TEST_SALT),
        role: 'nasabah',
        status: 'active',
      },
    });
    await prisma.user.create({
      data: {
        name: 'E2E Dup Phone User',
        email: 'e2e-dup2@contoh.test',
        phone: '081200012345',
        passwordHash: hashPassword(TEST_PASSWORD, TEST_SALT),
        role: 'nasabah',
        status: 'active',
      },
    });
    await prisma.user.create({
      data: {
        name: 'E2E Petugas User',
        email: 'e2e-petugas@contoh.test',
        passwordHash: hashPassword(TEST_PASSWORD, TEST_SALT),
        role: 'petugas',
        status: 'active',
      },
    });
    await prisma.user.create({
      data: {
        name: 'E2E Admin User',
        email: 'e2e-admin@contoh.test',
        passwordHash: hashPassword(TEST_PASSWORD, TEST_SALT),
        role: 'admin',
        status: 'active',
      },
    });
  });

  afterAll(async () => {
    for (const email of ['e2e-login@contoh.test', 'e2e-inactive@contoh.test', 'e2e-dup@contoh.test', 'e2e-dup2@contoh.test', 'e2e-reg@contoh.test', 'e2e-dup3@contoh.test']) {
      await prisma.user.deleteMany({ where: { email } });
    }
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('membuat akun nasabah baru dan mengembalikan token', async () => {
      const email = 'e2e-reg@contoh.test';
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'E2E Register', email, password: TEST_PASSWORD })
        .expect(201);

      expect(response.body.user).toMatchObject({
        email,
        name: 'E2E Register',
        role: 'nasabah',
        status: 'active',
      });
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.expiresIn).toBe(900);
    });

    it('menolak email duplikat dengan 409', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'E2E Dup', email: 'e2e-dup@contoh.test', password: TEST_PASSWORD })
        .expect(409);

      expect(response.body.code).toBe('DUPLICATE_CREDENTIALS');
      expect(response.body.message).toContain('sudah terdaftar');
    });

    it('menolak telepon duplikat dengan 409', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'E2E Dup 2', email: 'e2e-dup3@contoh.test', phone: '081200012345', password: TEST_PASSWORD })
        .expect(409);
      expect(response.body.code).toBe('DUPLICATE_CREDENTIALS');
    });

    it('validasi password lemah ditolak 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Test', email: `e2e-weak-${Date.now()}@contoh.test`, password: 'weak' })
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /auth/login', () => {
    it('login berhasil dengan email & password benar', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e-login@contoh.test', password: TEST_PASSWORD })
        .expect(200);

      expect(response.body.user).toMatchObject({
        email: 'e2e-login@contoh.test',
        role: 'nasabah',
        status: 'active',
      });
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      tokens.accessToken = response.body.accessToken;
      tokens.refreshToken = response.body.refreshToken;
    });

    it('login gagal dengan password salah → 401 pesan umum', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e-login@contoh.test', password: 'Salah123!' })
        .expect(401);

      expect(response.body.code).toBe('INVALID_CREDENTIALS');
      expect(response.body.message).toBe('Email/telepon atau kata sandi salah');
    });

    it('login gagal dengan email tidak ada → 401 pesan umum (sama)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'tidakada@contoh.test', password: TEST_PASSWORD })
        .expect(401);

      expect(response.body.code).toBe('INVALID_CREDENTIALS');
      expect(response.body.message).toBe('Email/telepon atau kata sandi salah');
    });

    it('login akun nonaktif ditolak 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e-inactive@contoh.test', password: TEST_PASSWORD })
        .expect(401);

      expect(response.body.code).toBe('ACCOUNT_INACTIVE');
      expect(response.body.message).toContain('tidak aktif');
    });
  });

  describe('POST /auth/refresh', () => {
    let originalRefreshToken: string;

    it('refresh token valid → access token baru + refresh token baru', async () => {
      originalRefreshToken = tokens.refreshToken ?? '';
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: originalRefreshToken })
        .expect(200);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.refreshToken).not.toBe(originalRefreshToken); // rotasi token
      expect(response.body.expiresIn).toBe(900);
      tokens.accessToken = response.body.accessToken;
      tokens.refreshToken = response.body.refreshToken;
    });

    it('refresh token lama tidak bisa dipakai lagi (rotasi)', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: originalRefreshToken })
        .expect(401);
    });

    it('refresh token tidak valid → 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.code).toBe('INVALID_REFRESH_TOKEN');
    });

    it('refresh token kedaluwarsa → 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'expired-token' })
        .expect(401);

      expect(response.body.code).toBe('INVALID_REFRESH_TOKEN');
    });
  });

  describe('POST /auth/logout', () => {
    it('logout mencabut refresh token → refresh berikutnya 401', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .send({ refreshToken: tokens.refreshToken })
        .expect(200);

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: tokens.refreshToken })
        .expect(401);
    });

    it('logout tanpa token → 401', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .send({})
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('mengembalikan profil user yang login', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        email: 'e2e-login@contoh.test',
        name: 'E2E Login User',
        role: 'nasabah',
        status: 'active',
      });
    });

    it('tanpa token → 401', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });
  });

  describe('POST /auth/forgot-password dan POST /auth/reset-password (BSD-30)', () => {
    it('forgot-password: respons generik untuk email tak terdaftar (tidak membocorkan)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: `e2e-nobody-${Date.now()}@contoh.test` })
        .expect(200);

      expect(response.body).toEqual({ sent: true });
    });

    it('forgot-password: email terdaftar → token reset dibuat (TTL 30 menit)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'e2e-login@contoh.test' })
        .expect(200);

      expect(response.body).toEqual({ sent: true });
      const tokens = await prisma.passwordResetToken.findMany({
        where: { user: { email: 'e2e-login@contoh.test' } },
      });
      expect(tokens).toHaveLength(1);
      expect(tokens[0].expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(tokens[0].expiresAt.getTime()).toBeLessThan(Date.now() + 30 * 60 * 1000);
    });

    it('reset-password: token tidak valid → 401', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: 'invalid-reset-token', password: TEST_PASSWORD })
        .expect(401);

      expect(response.body.code).toBe('INVALID_RESET_TOKEN');
    });

    it('reset-password: token valid → kata sandi baru + refresh token diinvalidasi', async () => {
      const user = await prisma.user.findUnique({ where: { email: 'e2e-login@contoh.test' } });
      const token = `e2e-reset-token-${Date.now()}`;
      await prisma.passwordResetToken.create({
        data: {
          userId: user!.id,
          tokenHash: scryptSync(token, 'reset-salt', 32).toString('hex'),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token, password: 'ResetPass123!' })
        .expect(200);

      expect(response.body).toEqual({ reset: true });

      // Token pakai sekali → sudah tidak valid.
      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token, password: 'ResetPass123!' })
        .expect(401);

      // Login pakai kata sandi baru berhasil.
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e-login@contoh.test', password: 'ResetPass123!' })
        .expect(200);
    });
  });

  describe('Rate limit pada endpoint auth (5/menit)', () => {
    it('POST /auth/login ke-6 dalam 1 menit → 429', async () => {
      let lastStatus = 200;
      for (let i = 0; i < 7 && lastStatus !== 429; i += 1) {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'e2e-login@contoh.test', password: 'Salah123!' });
        lastStatus = res.status;
      }

      expect(lastStatus).toBe(429);
    }, 30_000);

  describe('RBAC & authorization (BSD-36)', () => {
    it('endpoint publik tetap accesible tanpa token: GET /health', async () => {
      await request(app.getHttpServer()).get('/health').expect(200);
    });
    it('endpoint publik: POST /auth/register tanpa token OK (role nasabah)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Publik', email: `publ-${Date.now()}@contoh.test`, password: 'Password123!' })
        .expect(201);
      expect(res.body.user.role).toBe('nasabah');
    });
    it('protected endpoint without token → 401: GET /auth/me', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
    it('protected endpoint without token → 401: POST /auth/logout', async () => {
      await request(app.getHttpServer()).post('/auth/logout').send({}).expect(401);
    });
    it('nasabah tidak boleh akses route petugas: GET /petugas → 403', async () => {
      await request(app.getHttpServer())
        .get('/petugas')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(403);
    });
    it('petugas tidak boleh akses route admin: GET /admin → 403', async () => {
      const petugasLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e-petugas@contoh.test', password: TEST_PASSWORD })
        .expect(200);
      await request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', `Bearer ${petugasLogin.body.accessToken}`)
        .expect(403);
    });
    it('admin boleh akses /admin (200), bukan 403', async () => {
      const adminLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e-admin@contoh.test', password: TEST_PASSWORD })
        .expect(200);
      await request(app.getHttpServer())
        .get('/admin')
        .set('Authorization', `Bearer ${adminLogin.body.accessToken}`)
        .expect(200);
    });
  });
  });
});
