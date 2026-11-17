import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'budi@contoh.test' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Nomor telepon tidak valid' })
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'Simulasi123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/[A-Z]/, { message: 'Kata sandi harus mengandung huruf besar' })
  @Matches(/[a-z]/, { message: 'Kata sandi harus mengandung huruf kecil' })
  @Matches(/[0-9]/, { message: 'Kata sandi harus mengandung angka' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Kata sandi harus mengandung simbol' })
  password: string;
}