import { Injectable } from '@nestjs/common';
import { BlogService } from 'src/blog/blog.service';
import { PersonalRepository } from 'src/personal/personal.repository';

function xmlEscape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

@Injectable()
export class FeedsService {
  constructor(
    private readonly blogService: BlogService,
    private readonly personalRepo: PersonalRepository,
  ) {}

  private siteUrl(): string {
    return (
      process.env.SITE_URL ??
      process.env.FRONTEND_ORIGIN?.split(',')[0] ??
      'http://localhost:3000'
    );
  }

  async rss(): Promise<string> {
    const site = this.siteUrl();
    const posts = await this.blogService.rssData();
    const personal = await this.personalRepo.getSingleton();
    const title = personal ? `${personal.name} — blog` : 'Blog';
    const items = posts
      .map((p) => {
        const link = `${site}/blog/${p.slug}`;
        const date = (p.published_at ?? p.created_at).toUTCString();
        return `<item>
  <title>${xmlEscape(p.heading)}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${date}</pubDate>
  <description>${xmlEscape(p.excerpt || '')}</description>
</item>`;
      })
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${xmlEscape(title)}</title>
<link>${site}</link>
<description>${xmlEscape(personal?.sub_heading ?? '')}</description>
<language>en-us</language>
${items}
</channel>
</rss>`;
  }

  async sitemap(): Promise<string> {
    const site = this.siteUrl();
    const posts = await this.blogService.rssData();
    const urls = [
      `${site}/`,
      `${site}/blog`,
      `${site}/interests`,
      ...posts.map((p) => `${site}/blog/${p.slug}`),
    ];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
  }

  tags() {
    return this.blogService.tags();
  }
}
