import { IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9\s\-'_]+$/, { message: 'Nama hanya boleh huruf, angka, spasi, dan tanda titik/koma.' })
  name: string;

  @IsString()
  @IsEmail({}, { message: 'Format email tidak valid.' })
  email: string;

  @IsString()
  @Matches(/^[0-9+\-\s]{7,20}$/, { message: 'Nomor telepon tidak valid.' })
  phone: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, {
    message: 'Kata sandi minimal 8 karakter, huruf kapital, angka, dan simbol.',
  })
  password: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  unitId?: string;
}
