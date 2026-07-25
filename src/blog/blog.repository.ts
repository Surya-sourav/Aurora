import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { BlogRevision } from 'src/database/entities/blog-revision.entity';

const MAX_REVISIONS_PER_BLOG = 20;

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(Blog) private readonly repo: Repository<Blog>,
    @InjectRepository(BlogRevision)
    private readonly revRepo: Repository<BlogRevision>,
  ) {}

  async slugExists(slug: string): Promise<boolean> {
    const count = await this.repo.count({ where: { slug } });
    return count > 0;
  }

  findBySlug(slug: string, includeDrafts: boolean) {
    const qb = this.repo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.images', 'img')
      .where('b.slug = :slug', { slug });
    if (!includeDrafts) qb.andWhere('b.is_published = true');
    return qb.getOne();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['images'] });
  }

  async findManyPaginated(opts: {
    page: number;
    pageSize: number;
    tag?: string;
    category?: string;
    series?: string;
    search?: string;
    includeDrafts: boolean;
  }) {
    const qb = this.repo
      .createQueryBuilder('b')
      .orderBy('b.published_at', 'DESC', 'NULLS LAST')
      .addOrderBy('b.created_at', 'DESC');

    if (!opts.includeDrafts) qb.andWhere('b.is_published = true');
    if (opts.tag) qb.andWhere(':tag = ANY(b.tags)', { tag: opts.tag });
    if (opts.category) {
      qb.andWhere(
        'b.category_id = (SELECT id FROM category WHERE slug = :cslug LIMIT 1)',
        { cslug: opts.category },
      );
    }
    if (opts.series) {
      qb.andWhere(
        'b.series_id = (SELECT id FROM series WHERE slug = :sslug LIMIT 1)',
        { sslug: opts.series },
      );
    }
    if (opts.search) {
      const term = `%${opts.search}%`;
      qb.andWhere(
        new Brackets((q) => {
          q.where('b.heading ILIKE :term', { term })
            .orWhere('b.body ILIKE :term', { term })
            .orWhere('b.excerpt ILIKE :term', { term });
        }),
      );
    }
    qb.skip((opts.page - 1) * opts.pageSize).take(opts.pageSize);
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  findAllPublishedForRss(limit = 20) {
    return this.repo.find({
      where: { is_published: true },
      order: { published_at: 'DESC' },
      take: limit,
    });
  }

  async create(data: Partial<Blog>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, patch: Partial<Blog>) {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  softDelete(id: string) {
    return this.repo.softDelete({ id });
  }

  async incrementViewCount(id: string) {
    await this.repo.increment({ id }, 'view_count', 1);
  }

  async distinctTags(): Promise<Array<{ tag: string; count: number }>> {
    const rows = await this.repo
      .createQueryBuilder('b')
      .select('unnest(b.tags)', 'tag')
      .addSelect('COUNT(*)', 'count')
      .where('b.is_published = true')
      .groupBy('tag')
      .orderBy('count', 'DESC')
      .getRawMany<{ tag: string; count: string }>();
    return rows.map((r) => ({ tag: r.tag, count: parseInt(r.count, 10) }));
  }

  async totals(): Promise<{ total: number; published: number; drafts: number }> {
    const total = await this.repo.count();
    const published = await this.repo.count({ where: { is_published: true } });
    return { total, published, drafts: total - published };
  }

  async flipScheduledDue(now: Date): Promise<number> {
    const result = await this.repo
      .createQueryBuilder()
      .update(Blog)
      .set({
        is_published: true,
        published_at: () => 'COALESCE("published_at", NOW())',
        scheduled_publish_at: null,
      })
      .where('is_published = false')
      .andWhere('scheduled_publish_at IS NOT NULL')
      .andWhere('scheduled_publish_at <= :now', { now })
      .execute();
    return result.affected ?? 0;
  }

  async snapshotRevision(blog: Blog) {
    const entity = this.revRepo.create({
      blog_id: blog.id,
      heading: blog.heading,
      subheading: blog.subheading,
      body: blog.body,
      excerpt: blog.excerpt,
      tags: blog.tags,
    });
    await this.revRepo.save(entity);
    const count = await this.revRepo.count({ where: { blog_id: blog.id } });
    if (count > MAX_REVISIONS_PER_BLOG) {
      const excess = count - MAX_REVISIONS_PER_BLOG;
      const oldest = await this.revRepo
        .createQueryBuilder('r')
        .where('r.blog_id = :bid', { bid: blog.id })
        .orderBy('r.created_at', 'ASC')
        .take(excess)
        .getMany();
      if (oldest.length) {
        await this.revRepo.remove(oldest);
      }
    }
  }

  listRevisions(blogId: string) {
    return this.revRepo.find({
      where: { blog_id: blogId },
      order: { created_at: 'DESC' },
    });
  }

  findRevision(id: string) {
    return this.revRepo.findOne({ where: { id } });
  }
}
