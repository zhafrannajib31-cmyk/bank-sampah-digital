import { IsString, IsOptional } from 'class-validator';

export class UpdateWasteCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: 'active' | 'inactive';
}
