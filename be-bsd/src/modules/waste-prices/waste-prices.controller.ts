import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { WastePriceService } from './waste-prices.service';
import { CreateWastePriceDto } from './dto/create-waste-price.dto';
import { UpdateWastePriceDto } from './dto/update-waste-price.dto';

@ApiTags('waste-prices')
@Controller('waste-prices')
export class WastePriceController {
  constructor(private readonly priceService: WastePriceService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar harga sampah (semua role login)' })
  @ApiResponse({ status: 200, description: 'Daftar harga' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @UseGuards(RoleGuard)
  @Roles('admin', 'petugas', 'nasabah')
  async findAll(@Query('status') status?: string, @Query('categoryId') categoryId?: string) {
    return this.priceService.findAll(status, categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail harga' })
  @ApiResponse({ status: 200, description: 'Detail harga' })
  @ApiResponse({ status: 404, description: 'Harga tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin', 'petugas', 'nasabah')
  async findOne(@Param('id') id: string) {
    return this.priceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Buat harga sampah (admin)' })
  @ApiResponse({ status: 201, description: 'Harga dibuat' })
  @ApiResponse({ status: 409, description: 'Harga sudah ada' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async create(@Body() dto: CreateWastePriceDto, @Req() req: any) {
    return this.priceService.create(dto, req.user?.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Perbarui harga (admin)' })
  @ApiResponse({ status: 200, description: 'Harga diperbarui' })
  @ApiResponse({ status: 404, description: 'Harga tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateWastePriceDto, @Req() req: any) {
    return this.priceService.update(id, dto, req.user?.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus harga (admin)' })
  @ApiResponse({ status: 200, description: 'Harga dihapus' })
  @ApiResponse({ status: 404, description: 'Harga tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.priceService.remove(id);
  }
}
