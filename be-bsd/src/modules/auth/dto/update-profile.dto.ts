import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Nama lengkap', example: 'Aden Arya Dimas Fauzan' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'aden@gmail.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Nomor telepon', example: '+62 812 3456 7890' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
