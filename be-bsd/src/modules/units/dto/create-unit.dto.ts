import { IsString, IsOptional, Matches, IsBoolean } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  @Matches(/^-?(0|[1-9]\d*)\.(\d+)$/, { message: 'Latitude harus berupa angka desimal.' })
  latitude?: string;

  @IsOptional()
  @Matches(/^-?(0|[1-9]\d*)\.(\d+)$/, { message: 'Longitude harus berupa angka desimal.' })
  longitude?: string;

  @IsString()
  @IsOptional()
  operatingHours?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  serviceStatus?: 'open' | 'closed' | 'temporarily_closed';

  @IsString()
  @IsOptional()
  publicationStatus?: 'draft' | 'published' | 'unpublished';

  @IsBoolean()
  @IsOptional()
  isSimulated?: boolean;
}
