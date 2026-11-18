import { IsString, IsArray, ValidateNested, IsMongoId, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepositItemDto {
  @IsString()
  categoryId: string;

  @IsString()
  @Min(0.001, { message: 'Estimasi berat harus > 0' })
  estimatedWeight: string;

  @IsOptional()
  @IsString()
  @Min(0.001, { message: 'Estimasi berat harus > 0' })
  actualWeight?: string;
}

export class CreateDepositDto {
  @IsString()
  @IsMongoId({ message: 'unitId harus UUID valid' })
  unitId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDepositItemDto)
  items: CreateDepositItemDto[];
}
