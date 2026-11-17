import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar pengguna (admin)' })
  @ApiResponse({ status: 200, description: 'Daftar pengguna' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak: role admin diperlukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async findAll(@Query('role') role?: string, @Query('status') status?: string) {
    return this.userService.findAll(role, status);
  }

  @Post()
  @ApiOperation({ summary: 'Buat akun petugas baru' })
  @ApiResponse({ status: 201, description: 'Akun dibuat' })
  @ApiResponse({ status: 409, description: 'Email/telepon sudah terdaftar' })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id/aktifasi')
  @ApiOperation({ summary: 'Aktifkan atau nonaktifkan akun' })
  @ApiResponse({ status: 200, description: 'Status akun diperbarui' })
  @ApiResponse({ status: 403, description: 'Akses ditolak: role admin diperlukan' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.userService.toggleStatus(id, dto.status);
  }
}
