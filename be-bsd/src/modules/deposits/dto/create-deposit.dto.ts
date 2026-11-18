import { IsString, IsArray, ValidateNested, IsUUID, Matches, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

const WEIGHT_PATTERN = /^\d+(\.\d{1,3})?$/;

export class CreateDepositItemDto {
  @IsString()
  categoryId: string;

  @IsString()
  @Matches(WEIGHT_PATTERN, { message: 'Estimasi berat harus angka positif (maks 3 desimal)' })
  estimatedWeight: string;

  @IsOptional()
  @IsString()
  @Matches(WEIGHT_PATTERN, { message: 'Berat aktual harus angka positif (maks 3 desimal)' })
  actualWeight?: string;
}

export class CreateDepositDto {
  @IsString()
  @IsUUID('4', { message: 'unitId harus UUID valid' })
  unitId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDepositItemDto)
  items: CreateDepositItemDto[];
}
