import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { ipFingerprint } from 'src/common/utils/ip-fingerprint';

@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async list(
    @Query() query: BlogQueryDto,
    @Req() req: Request & { user?: unknown },
  ) {
    const data = await this.service.list(query, Boolean(req.user));
    return { success: true, ...data };
  }

  @Get('totals')
  @UseGuards(JwtAuthGuard)
  totals() {
    return this.service.totals();
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  async getBySlug(
    @Param('slug') slug: string,
    @Req() req: Request & { user?: unknown },
  ) {
    const blog = await this.service.getBySlug(slug, Boolean(req.user));
    void this.service
      .maybeIncrementBlogViews(blog.id, ipFingerprint(req), Boolean(req.user))
      .catch(() => undefined);
    return { success: true, blog };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateBlogDto) {
    const blog = await this.service.create(dto);
    return { success: true, blog };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    const blog = await this.service.update(id, dto);
    return { success: true, blog };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
