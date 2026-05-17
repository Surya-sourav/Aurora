import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalImage } from 'src/database/entities/personal-image.entity';

@Injectable()
export class PersonalImageRepository {
  constructor(
    @InjectRepository(PersonalImage)
    private readonly repo: Repository<PersonalImage>,
  ) {}

  findWithBytes(id: string) {
    return this.repo
      .createQueryBuilder('pi')
      .addSelect('pi.data')
      .where('pi.id = :id', { id })
      .getOne();
  }

  async nextSortOrder(personal_id: string): Promise<number> {
    const row = await this.repo
      .createQueryBuilder('pi')
      .select('COALESCE(MAX(pi.sort_order), -1)', 'max')
      .where('pi.personal_id = :personal_id', { personal_id })
      .getRawOne<{ max: string | number | null }>();
    return Number(row?.max ?? -1) + 1;
  }

  async create(data: Partial<PersonalImage>) {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return {
      id: saved.id,
      mime_type: saved.mime_type,
      alt_text: saved.alt_text,
      sort_order: saved.sort_order,
      size_bytes: saved.size_bytes,
    };
  }

  async update(id: string, patch: Partial<PersonalImage>) {
    await this.repo.update({ id }, patch);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }
}
