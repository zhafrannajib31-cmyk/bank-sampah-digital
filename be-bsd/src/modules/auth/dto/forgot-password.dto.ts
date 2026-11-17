import { IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'budi@contoh.test' })
  @IsEmail()
  @MaxLength(255)
  email: string;
}
