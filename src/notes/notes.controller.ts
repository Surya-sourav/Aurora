import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { ipFingerprint } from 'src/common/utils/ip-fingerprint';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Get()
  async list() {
    const items = await this.service.list();
    return { success: true, items };
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  async getBySlug(
    @Param('slug') slug: string,
    @Req() req: Request & { user?: unknown },
  ) {
    const item = await this.service.getBySlug(slug);
    void this.service
      .maybeIncrementViews(item.id, ipFingerprint(req), Boolean(req.user))
      .catch(() => undefined);
    return { success: true, item };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateNoteDto) {
    const item = await this.service.create(dto);
    return { success: true, item };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    const item = await this.service.update(id, dto);
    return { success: true, item };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
