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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { WasteCategoryService } from './waste-categories.service';
import { CreateWasteCategoryDto } from './dto/create-waste-category.dto';
import { UpdateWasteCategoryDto } from './dto/update-waste-category.dto';

@ApiTags('waste-categories')
@Controller('waste-categories')
export class WasteCategoryController {
  constructor(private readonly categoryService: WasteCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar kategori sampah' })
  @ApiResponse({ status: 200, description: 'Daftar kategori' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async findAll(@Query('status') status?: string) {
    return this.categoryService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail kategori' })
  @ApiResponse({ status: 200, description: 'Detail kategori' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Buat kategori baru (admin)' })
  @ApiResponse({ status: 201, description: 'Kategori dibuat' })
  @ApiResponse({ status: 409, description: 'Nama kategori sudah ada' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async create(@Body() dto: CreateWasteCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Perbarui kategori (admin)' })
  @ApiResponse({ status: 200, description: 'Kategori diperbarui' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateWasteCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus kategori (admin)' })
  @ApiResponse({ status: 200, description: 'Kategori dihapus' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
