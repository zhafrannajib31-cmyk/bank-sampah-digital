import { IsString, IsOptional, Matches } from 'class-validator';

export class CreateWasteCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: 'active' | 'inactive';
}

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
