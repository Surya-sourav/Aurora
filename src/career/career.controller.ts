import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CareerService } from './career.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

@Controller('career')
export class CareerController {
  constructor(private readonly service: CareerService) {}

  @Get()
  async list() {
    const items = await this.service.list();
    return { success: true, items };
  }

  @Get(':id/logo')
  async streamLogo(@Param('id') id: string, @Res() res: Response) {
    const row = await this.service.getLogo(id);
    if (!row || !row.logo) throw new NotFoundException();
    res.setHeader('Content-Type', row.logo_mime || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', `"career-${id}"`);
    res.end(row.logo);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const item = await this.service.getById(id);
    return { success: true, item };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCareerDto) {
    const item = await this.service.create(dto);
    return { success: true, item };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateCareerDto) {
    const item = await this.service.update(id, dto);
    return { success: true, item };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Put(':id/logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_BYTES },
    }),
  )
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!ALLOWED_MIMES.has(file.mimetype))
      throw new BadRequestException(`Unsupported mime ${file.mimetype}`);
    const item = await this.service.setLogo(id, file);
    return { success: true, item };
  }

  @Delete(':id/logo')
  @UseGuards(JwtAuthGuard)
  async removeLogo(@Param('id') id: string) {
    const item = await this.service.removeLogo(id);
    return { success: true, item };
  }
}
