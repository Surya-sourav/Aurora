import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { PersonalRepository } from 'src/personal/personal.repository';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { Blog } from 'src/database/entities/blog.entity';
import {
  computeReadingTime,
  deriveExcerpt,
  generateUniqueSlug,
} from 'src/common/utils/slug';
import { viewDebouncer } from 'src/common/utils/view-debounce';

type BlogSummary = Omit<Blog, 'body'>;

@Injectable()
export class BlogService {
  private lastScheduledCheck = 0;

  constructor(
    private readonly repo: BlogRepository,
    private readonly personalRepo: PersonalRepository,
  ) {}

  private async maybeFlipScheduled() {
    const now = Date.now();
    if (now - this.lastScheduledCheck < 30_000) return;
    this.lastScheduledCheck = now;
    try {
      await this.repo.flipScheduledDue(new Date());
    } catch {
      /* ignore */
    }
  }

  async list(query: BlogQueryDto, includeDrafts: boolean) {
    await this.maybeFlipScheduled();
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const { items, total } = await this.repo.findManyPaginated({
      page,
      pageSize,
      tag: query.tag,
      category: query.category,
      series: query.series,
      search: query.search,
      includeDrafts,
    });
    return {
      items: items.map((b): BlogSummary => {
        const { body: _body, ...rest } = b;
        return rest;
      }),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  async getBySlug(slug: string, includeDrafts: boolean) {
    await this.maybeFlipScheduled();
    const blog = await this.repo.findBySlug(slug, includeDrafts);
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async maybeIncrementBlogViews(
    id: string,
    fingerprint: string,
    isAdmin: boolean,
  ) {
    if (isAdmin) return;
    if (!viewDebouncer.shouldCount(`blog:${id}`, fingerprint)) return;
    await this.repo.incrementViewCount(id);
  }

  async create(dto: CreateBlogDto) {
    const personal = await this.personalRepo.getSingleton();
    const slugBase = dto.slug || dto.heading;
    const slug = await generateUniqueSlug(slugBase, (s) => this.repo.slugExists(s));
    const reading_time_minutes = computeReadingTime(dto.body);
    const excerpt = dto.excerpt || deriveExcerpt(dto.body);
    const is_published = dto.is_published ?? false;
    const published_at = is_published ? new Date() : null;
    const scheduled_publish_at =
      dto.scheduled_publish_at ? new Date(dto.scheduled_publish_at) : null;

    return this.repo.create({
      heading: dto.heading,
      subheading: dto.subheading ?? '',
      body: dto.body,
      excerpt,
      signature: dto.signature ?? '',
      tags: dto.tags ?? [],
      slug,
      reading_time_minutes,
      is_published,
      published_at,
      view_count: 0,
      personal_id: personal?.id ?? null,
      category_id: dto.category_id ?? null,
      series_id: dto.series_id ?? null,
      series_order: dto.series_order ?? 0,
      scheduled_publish_at,
      mastodon_post_url: dto.mastodon_post_url ?? '',
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Blog not found');

    // Snapshot before we mutate — captures the pre-edit state
    if (existing.body) {
      await this.repo.snapshotRevision(existing).catch(() => undefined);
    }

    const patch: Partial<Blog> = {};
    if (dto.heading !== undefined) patch.heading = dto.heading;
    if (dto.subheading !== undefined) patch.subheading = dto.subheading;
    if (dto.body !== undefined) patch.body = dto.body;
    if (dto.signature !== undefined) patch.signature = dto.signature;
    if (dto.tags !== undefined) patch.tags = dto.tags;
    if (dto.excerpt !== undefined) patch.excerpt = dto.excerpt;
    if (dto.is_published !== undefined) patch.is_published = dto.is_published;
    if (dto.category_id !== undefined) patch.category_id = dto.category_id;
    if (dto.series_id !== undefined) patch.series_id = dto.series_id;
    if (dto.series_order !== undefined) patch.series_order = dto.series_order;
    if (dto.mastodon_post_url !== undefined)
      patch.mastodon_post_url = dto.mastodon_post_url;
    if (dto.scheduled_publish_at !== undefined) {
      patch.scheduled_publish_at = dto.scheduled_publish_at
        ? new Date(dto.scheduled_publish_at)
        : null;
    }

    if (dto.body !== undefined && dto.body !== existing.body) {
      patch.reading_time_minutes = computeReadingTime(dto.body);
      if (dto.excerpt === undefined) patch.excerpt = deriveExcerpt(dto.body);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      patch.slug = await generateUniqueSlug(dto.slug, (s) =>
        this.repo.slugExists(s),
      );
    } else if (
      dto.heading &&
      !dto.slug &&
      dto.heading !== existing.heading &&
      !existing.is_published
    ) {
      patch.slug = await generateUniqueSlug(dto.heading, (s) =>
        this.repo.slugExists(s),
      );
    }

    if (dto.is_published === true && !existing.published_at) {
      patch.published_at = new Date();
    }

    return this.repo.update(id, patch);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Blog not found');
    await this.repo.softDelete(id);
    return { success: true };
  }

  tags() {
    return this.repo.distinctTags();
  }

  rssData() {
    return this.repo.findAllPublishedForRss(20);
  }

  totals() {
    return this.repo.totals();
  }

  listRevisions(blogId: string) {
    return this.repo.listRevisions(blogId);
  }
}
