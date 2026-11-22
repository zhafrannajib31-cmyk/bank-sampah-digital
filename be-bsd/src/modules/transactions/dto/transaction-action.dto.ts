import { ArrayMinSize, IsArray, IsString, IsUUID, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/** Desimal positif, maksimal 3 angka di belakang koma; nol ditolak. */
const POSITIVE_WEIGHT = /^(?:0*[1-9]\d*)(?:\.\d{1,3})?$/;

/** Alasan wajib untuk setiap pembatalan/koreksi pasca-konfirmasi (D-05). */
export class CancelTransactionDto {
  @IsString({ message: 'Alasan harus berupa teks' })
  @Matches(/\S/, { message: 'Alasan wajib diisi' })
  reason!: string;
}

export class CorrectItemDto {
  @IsUUID('4', { message: 'itemId harus UUID valid' })
  itemId!: string;

  @Matches(POSITIVE_WEIGHT, { message: 'Berat koreksi harus angka positif (maks 3 desimal)' })
  actualWeight!: string;
}

export class CorrectTransactionDto extends CancelTransactionDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Minimal satu item harus dikoreksi.' })
  @ValidateNested({ each: true })
  @Type(() => CorrectItemDto)
  items!: CorrectItemDto[];
}
