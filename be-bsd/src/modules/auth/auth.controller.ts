import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './guards/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Registrasi nasabah baru (hanya role nasabah)' })
  @ApiResponse({ status: 201, description: 'Akun dibuat, token dikembalikan' })
  @ApiResponse({ status: 409, description: 'Email/telepon sudah terdaftar' })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login nasabah/petugas/admin' })
  @ApiResponse({ status: 200, description: 'Login berhasil, token dikembalikan' })
  @ApiResponse({ status: 401, description: 'Kredensial salah atau akun tidak aktif' })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (mencabut refresh token)' })
  @ApiResponse({ status: 200, description: 'Logout berhasil' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  async logout(@CurrentUser('sub') userId: string, @Body('refreshToken') refreshToken?: string) {
    return this.auth.logout(userId, refreshToken);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Memperbarui access token dengan refresh token' })
  @ApiResponse({ status: 200, description: 'Token baru diterbitkan' })
  @ApiResponse({ status: 401, description: 'Refresh token tidak valid/kedaluwarsa' })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  async refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Minta reset kata sandi (respons tidak membocorkan status akun)' })
  @ApiResponse({ status: 200, description: 'Respons generik selalu dikembalikan' })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset kata sandi pakai token dari forgot-password (sekali pakai, kadaluarsa)' })
  @ApiResponse({ status: 200, description: 'Kata sandi berhasil direset' })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  @ApiResponse({ status: 401, description: 'Token reset tidak valid/kedaluwarsa' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil pengguna yang sedang login' })
  @ApiResponse({ status: 200, description: 'Data pengguna' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  async me(@CurrentUser() user: { sub: string; email: string; name: string; role: string; status: string }) {
    return user;
  }
}