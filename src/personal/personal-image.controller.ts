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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonalImageService } from './personal-image.service';
import {
  CreatePersonalImageMetaDto,
  UpdatePersonalImageDto,
} from './dto/personal-image.dto';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

@Controller('personal/images')
export class PersonalImageController {
  constructor(private readonly service: PersonalImageService) {}

  @Get(':id')
  async stream(@Param('id') id: string, @Res() res: Response) {
    const img = await this.service.getBytes(id);
    if (!img) throw new NotFoundException();
    res.setHeader('Content-Type', img.mime_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', `"pi-${id}"`);
    res.end(img.data);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_BYTES },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: CreatePersonalImageMetaDto,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!ALLOWED_MIMES.has(file.mimetype))
      throw new BadRequestException(`Unsupported mime ${file.mimetype}`);
    const image = await this.service.create(file, body.alt_text ?? '');
    return { success: true, image };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePersonalImageDto,
  ) {
    const image = await this.service.update(id, dto);
    return { success: true, image };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }
}
