import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'a1b2c3d4e5f6...' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  token: string;

  @ApiProperty({ example: 'Simulasi123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
