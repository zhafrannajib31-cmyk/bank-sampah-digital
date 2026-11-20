import { ArrayMinSize, IsArray, IsOptional, IsUUID, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/** Desimal positif, maksimal 3 angka di belakang koma; nol ditolak. */
const POSITIVE_WEIGHT = /^(?:0*[1-9]\d*)(?:\.\d{1,3})?$/;

export class UpdateWeightItemDto {
  @IsUUID('4', { message: 'itemId harus UUID valid' })
  itemId!: string;

  @Matches(POSITIVE_WEIGHT, { message: 'Berat aktual harus angka positif (maks 3 desimal)' })
  actualWeight!: string;

  /** Koreksi kategori oleh petugas (FR-11); bila diisi harus kategori aktif. */
  @IsOptional()
  @IsUUID('4', { message: 'categoryId harus UUID valid' })
  categoryId?: string;
}

export class UpdateWeightDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Minimal satu item harus ditimbang.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateWeightItemDto)
  items!: UpdateWeightItemDto[];
}
