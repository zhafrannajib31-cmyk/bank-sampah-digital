import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryUnitsDto {
  @ApiPropertyOptional({ description: 'Kata kunci nama atau alamat unit' })
  @IsOptional()
  @IsString({ message: 'search harus berupa teks.' })
  @MaxLength(150, { message: 'search maksimal 150 karakter.' })
  search?: string;

  @ApiPropertyOptional({ description: 'Area atau alamat unit' })
  @IsOptional()
  @IsString({ message: 'area harus berupa teks.' })
  @MaxLength(150, { message: 'area maksimal 150 karakter.' })
  area?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published', 'unpublished'] })
  @IsOptional()
  @IsIn(['draft', 'published', 'unpublished'], {
    message: 'publicationStatus harus draft, published, atau unpublished.',
  })
  publicationStatus?: string;

  @ApiPropertyOptional({ enum: ['open', 'closed', 'temporarily_closed'] })
  @IsOptional()
  @IsIn(['open', 'closed', 'temporarily_closed'], {
    message: 'serviceStatus harus open, closed, atau temporarily_closed.',
  })
  serviceStatus?: string;
}
