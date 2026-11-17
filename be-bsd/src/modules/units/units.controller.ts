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
import { UnitService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@ApiTags('units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar unit Bank Sampah (admin)' })
  @ApiResponse({ status: 200, description: 'Daftar unit' })
  @ApiResponse({ status: 401, description: 'Belum login' })
  @ApiResponse({ status: 403, description: 'Akses ditolak: role admin diperlukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async findAll(
    @Query('search') search?: string,
    @Query('area') area?: string,
    @Query('publicationStatus') publicationStatus?: string,
    @Query('serviceStatus') serviceStatus?: string,
  ) {
    return this.unitService.findAll(search, area, publicationStatus, serviceStatus);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail unit' })
  @ApiResponse({ status: 200, description: 'Detail unit' })
  @ApiResponse({ status: 404, description: 'Unit tidak ditemukan' })
  async findOne(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }

  @Get(':id/distance')
  @ApiOperation({ summary: 'Info jarak unit ke titik koordinat (admin)' })
  @ApiResponse({ status: 200, description: 'Daftar unit beserta jarak (km)' })
  @ApiResponse({ status: 404, description: 'Unit tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async findDistance(
    @Param('id') id: string,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    const units = await this.unitService.findDistance(lat, lng);
    return units;
  }

  @Post()
  @ApiOperation({ summary: 'Buat unit baru (admin)' })
  @ApiResponse({ status: 201, description: 'Unit dibuat' })
  @ApiResponse({ status: 409, description: 'Data sudah ada' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async create(@Body() dto: CreateUnitDto) {
    return this.unitService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Perbarui unit (admin)' })
  @ApiResponse({ status: 200, description: 'Unit diperbarui' })
  @ApiResponse({ status: 404, description: 'Unit tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.unitService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus unit (admin)' })
  @ApiResponse({ status: 200, description: 'Unit dihapus' })
  @ApiResponse({ status: 404, description: 'Unit tidak ditemukan' })
  @UseGuards(RoleGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.unitService.remove(id);
  }
}
