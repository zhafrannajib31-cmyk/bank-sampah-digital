import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

const DEFAULT_MESSAGES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Permintaan tidak valid.',
  [HttpStatus.UNAUTHORIZED]: 'Anda belum terautentikasi.',
  [HttpStatus.FORBIDDEN]: 'Anda tidak memiliki akses untuk tindakan ini.',
  [HttpStatus.NOT_FOUND]: 'Data yang diminta tidak ditemukan.',
  [HttpStatus.CONFLICT]: 'Data bertentangan dengan data yang sudah ada.',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Data tidak dapat diproses.',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Terlalu banyak permintaan, coba lagi nanti.',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Terjadi kesalahan pada server.',
};

const DEFAULT_CODES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
  [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
};

// Pesan bawaan Nest berbahasa Inggris diganti versi Indonesia; pesan buatan aplikasi dibiarkan.
const NEST_DEFAULT_MESSAGES = [
  /^cannot (get|post|put|patch|delete) /i,
  /^unauthorized$/i,
  /^forbidden resource$/i,
  /^not found$/i,
  /^bad request$/i,
  /^conflict$/i,
  /^internal server error$/i,
];

function normalizeMessage(status: number, raw: unknown): string | string[] {
  const fallback = DEFAULT_MESSAGES[status] ?? 'Terjadi kesalahan.';
  if (Array.isArray(raw)) {
    return raw.length > 0 ? (raw as string[]) : fallback;
  }
  if (typeof raw === 'string' && raw.trim() !== '') {
    return NEST_DEFAULT_MESSAGES.some((pattern) => pattern.test(raw.trim()))
      ? fallback
      : raw;
  }
  return fallback;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const raw = exception instanceof HttpException ? exception.getResponse() : null;
    const payload =
      typeof raw === 'object' && raw !== null
        ? (raw as Record<string, unknown>)
        : {};

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.message : String(exception),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      message: normalizeMessage(status, payload.message ?? raw),
      code:
        typeof payload.code === 'string'
          ? payload.code
          : (DEFAULT_CODES[status] ?? `HTTP_${status}`),
    });
  }
}
