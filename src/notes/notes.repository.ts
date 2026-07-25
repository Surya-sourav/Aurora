import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from 'src/database/entities/note.entity';

@Injectable()
export class NotesRepository {
  constructor(@InjectRepository(Note) private readonly repo: Repository<Note>) {}

  async slugExists(slug: string): Promise<boolean> {
    return (await this.repo.count({ where: { slug } })) > 0;
  }

  findAll(limit?: number) {
    const qb = this.repo.createQueryBuilder('n').orderBy('n.created_at', 'DESC');
    if (limit) qb.take(limit);
    return qb.getMany();
  }

  findBySlug(slug: string) {
    return this.repo.findOne({ where: { slug } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Note>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, patch: Partial<Note>) {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }

  async incrementViewCount(id: string) {
    await this.repo.increment({ id }, 'view_count', 1);
  }
}
