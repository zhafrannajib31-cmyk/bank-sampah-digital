import { Controller, INestApplication, Post, Body } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

class ProbeDto {
  @IsString({ message: 'nama harus berupa teks.' })
  @IsNotEmpty({ message: 'nama wajib diisi.' })
  @MinLength(3, { message: 'nama minimal 3 karakter.' })
  @MaxLength(10, { message: 'nama maksimal 10 karakter.' })
  nama!: string;
}

@Controller('probe')
class ProbeController {
  @Post()
  create(@Body() body: ProbeDto): ProbeDto {
    return body;
  }
}

describe('Arsitektur API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [ProbeController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('menolak input tidak valid dengan pesan bahasa Indonesia', async () => {
    const response = await request(app.getHttpServer())
      .post('/probe')
      .send({ nama: '' })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.message).toContain('nama wajib diisi.');
  });

  it('menerima input valid dan membuang properti yang tidak dikenal', async () => {
    const response = await request(app.getHttpServer())
      .post('/probe')
      .send({ nama: 'Budi', lain: 'abaikan' })
      .expect(201);

    expect(response.body).toEqual({ nama: 'Budi' });
  });

  it('mengembalikan 404 dengan format error yang konsisten', async () => {
    const response = await request(app.getHttpServer())
      .get('/tidak-ada')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Data yang diminta tidak ditemukan.',
      code: 'NOT_FOUND',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
