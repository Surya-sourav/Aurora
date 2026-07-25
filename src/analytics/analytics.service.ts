import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { Personal } from 'src/database/entities/personal.entity';
import { Note } from 'src/database/entities/note.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    @InjectRepository(Personal) private readonly personalRepo: Repository<Personal>,
    @InjectRepository(Note) private readonly noteRepo: Repository<Note>,
  ) {}

  async summary() {
    const personal = await this.personalRepo.findOne({ where: {} });
    const totalBlogs = await this.blogRepo.count();
    const published = await this.blogRepo.count({ where: { is_published: true } });
    const drafts = totalBlogs - published;
    const totalNotes = await this.noteRepo.count();

    const totalViewsResult = await this.blogRepo
      .createQueryBuilder('b')
      .select('COALESCE(SUM(b.view_count), 0)', 'sum')
      .where('b.is_published = true')
      .getRawOne<{ sum: string }>();
    const total_blog_views = parseInt(totalViewsResult?.sum ?? '0', 10);

    const noteViewsResult = await this.noteRepo
      .createQueryBuilder('n')
      .select('COALESCE(SUM(n.view_count), 0)', 'sum')
      .getRawOne<{ sum: string }>();
    const total_note_views = parseInt(noteViewsResult?.sum ?? '0', 10);

    const topPosts = await this.blogRepo
      .createQueryBuilder('b')
      .where('b.is_published = true')
      .orderBy('b.view_count', 'DESC')
      .limit(10)
      .getMany();

    const recentDrafts = await this.blogRepo
      .createQueryBuilder('b')
      .where('b.is_published = false')
      .orderBy('b.updated_at', 'DESC')
      .limit(5)
      .getMany();

    return {
      portfolio_views: personal?.portfolio_view_count ?? 0,
      total_blog_views,
      total_note_views,
      total_blogs: totalBlogs,
      published_blogs: published,
      draft_blogs: drafts,
      total_notes: totalNotes,
      top_posts: topPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        heading: p.heading,
        view_count: p.view_count,
        published_at: p.published_at,
      })),
      recent_drafts: recentDrafts.map((p) => ({
        id: p.id,
        slug: p.slug,
        heading: p.heading,
        updated_at: p.updated_at,
      })),
    };
  }
}
