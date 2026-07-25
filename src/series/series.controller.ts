import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

@Controller('series')
export class SeriesController {
  constructor(private readonly service: SeriesService) {}

  @Get()
  async list() {
    const items = await this.service.list();
    return { success: true, items };
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const data = await this.service.getBySlug(slug);
    return { success: true, ...data };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateSeriesDto) {
    const item = await this.service.create(dto);
    return { success: true, item };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateSeriesDto) {
    const item = await this.service.update(id, dto);
    return { success: true, item };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
