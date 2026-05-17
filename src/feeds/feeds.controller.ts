import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FeedsService } from './feeds.service';

@Controller()
export class FeedsController {
  constructor(private readonly service: FeedsService) {}

  @Get('rss.xml')
  async rss(@Res() res: Response) {
    const xml = await this.service.rss();
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(xml);
  }

  @Get('sitemap.xml')
  async sitemap(@Res() res: Response) {
    const xml = await this.service.sitemap();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(xml);
  }

  @Get('tags')
  async tags() {
    const tags = await this.service.tags();
    return { success: true, tags };
  }
}
