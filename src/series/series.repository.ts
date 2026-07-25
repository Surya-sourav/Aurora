import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from 'src/database/entities/series.entity';
import { Blog } from 'src/database/entities/blog.entity';

@Injectable()
export class SeriesRepository {
  constructor(
    @InjectRepository(Series) private readonly repo: Repository<Series>,
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
  ) {}

  async slugExists(slug: string): Promise<boolean> {
    return (await this.repo.count({ where: { slug } })) > 0;
  }

  findAll() {
    return this.repo
      .createQueryBuilder('s')
      .orderBy('s.sort_order', 'ASC')
      .addOrderBy('s.name', 'ASC')
      .getMany();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.repo.findOne({ where: { slug } });
  }

  async create(data: Partial<Series>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, patch: Partial<Series>) {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }

  postsInSeries(seriesId: string) {
    return this.blogRepo
      .createQueryBuilder('b')
      .where('b.series_id = :sid AND b.is_published = true', { sid: seriesId })
      .orderBy('b.series_order', 'ASC')
      .addOrderBy('b.published_at', 'ASC')
      .getMany();
  }
}
