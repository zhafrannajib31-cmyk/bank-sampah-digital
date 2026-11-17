import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

// shortcut: pesan tiap constraint ditulis bahasa Indonesia di DTO (`message:`); yang lupa akan tampil dalam bahasa Inggris.
function collectMessages(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => [
    ...Object.values(error.constraints ?? {}),
    ...collectMessages(error.children ?? []),
  ]);
}

export const appValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors) => {
    const messages = collectMessages(errors);
    return new BadRequestException({
      message: messages.length > 0 ? messages : ['Permintaan tidak valid.'],
      code: 'VALIDATION_ERROR',
    });
  },
});
