import { IsString, IsIn } from 'class-validator';

export class UpdateUserStatusDto {
  @IsString()
  @IsIn(['active', 'inactive'], { message: 'status harus active atau inactive.' })
  status: 'active' | 'inactive';
}
