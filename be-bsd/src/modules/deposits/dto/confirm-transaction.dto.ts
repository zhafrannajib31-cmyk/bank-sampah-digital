import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/** Kunci idempotensi permintaan konfirmasi (TC-09). */
export class ConfirmTransactionDto {
  @IsString({ message: 'idempotencyKey harus berupa teks' })
  @IsNotEmpty({ message: 'idempotencyKey wajib diisi' })
  @MaxLength(100, { message: 'idempotencyKey maksimal 100 karakter' })
  idempotencyKey!: string;
}
