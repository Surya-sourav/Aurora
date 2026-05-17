import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
import { ImageService } from './image.service';
import { CreateImageMetaDto } from './dto/create-image.dto';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

@Controller('images')
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @Get(':id')
  async stream(@Param('id') id: string, @Res() res: Response) {
    const img = await this.service.getBytes(id);
    if (!img) throw new NotFoundException();
    res.setHeader('Content-Type', img.mime_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', `"img-${id}"`);
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
    @Body() body: CreateImageMetaDto,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!ALLOWED_MIMES.has(file.mimetype))
      throw new BadRequestException(`Unsupported mime ${file.mimetype}`);
    const image = await this.service.create(file, body.alt_text ?? '', body.blog_id);
    return { success: true, image };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }
}
