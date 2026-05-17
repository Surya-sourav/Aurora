import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from 'src/database/entities/image.entity';

@Injectable()
export class ImageRepository {
  constructor(@InjectRepository(Image) private readonly repo: Repository<Image>) {}

  findWithBytes(id: string) {
    return this.repo
      .createQueryBuilder('i')
      .addSelect('i.data')
      .where('i.id = :id', { id })
      .getOne();
  }

  async create(data: Partial<Image>) {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return {
      id: saved.id,
      mime_type: saved.mime_type,
      alt_text: saved.alt_text,
      size_bytes: saved.size_bytes,
      blog_id: saved.blog_id,
    };
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }
}
