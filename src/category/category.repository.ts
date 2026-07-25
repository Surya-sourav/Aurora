import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/database/entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>,
  ) {}

  async slugExists(slug: string): Promise<boolean> {
    const c = await this.repo.count({ where: { slug } });
    return c > 0;
  }

  findAll() {
    return this.repo
      .createQueryBuilder('c')
      .orderBy('c.sort_order', 'ASC')
      .addOrderBy('c.name', 'ASC')
      .getMany();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.repo.findOne({ where: { slug } });
  }

  async create(data: Partial<Category>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, patch: Partial<Category>) {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }

  async countsBySlug(): Promise<Array<{ slug: string; count: number }>> {
    const rows = await this.repo
      .createQueryBuilder('c')
      .leftJoin('blog', 'b', 'b.category_id = c.id AND b.is_published = true AND b.deleted_at IS NULL')
      .select('c.slug', 'slug')
      .addSelect('COUNT(b.id)', 'count')
      .groupBy('c.slug')
      .getRawMany<{ slug: string; count: string }>();
    return rows.map((r) => ({ slug: r.slug, count: parseInt(r.count, 10) }));
  }
}
