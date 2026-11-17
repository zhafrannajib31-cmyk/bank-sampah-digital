import { IsString, IsOptional, IsDecimal, MinDate, IsBoolean } from 'class-validator';

export class UpdateWastePriceDto {
  @IsString()
  @IsOptional()
  unitId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  pricePerKg?: string;

  @IsString()
  @IsOptional()
  @MinDate(new Date(), { message: 'Tanggal berlaku tidak boleh masa lalu.' })
  effectiveFrom?: string;

  @IsString()
  @IsOptional()
  effectiveTo?: string;

  @IsString()
  @IsOptional()
  status?: 'active' | 'inactive';

  @IsBoolean()
  @IsOptional()
  isSimulated?: boolean;
}
