import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from 'src/database/entities/bookmark.entity';
import { PersonalRepository } from 'src/personal/personal.repository';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) private readonly repo: Repository<Bookmark>,
    private readonly personalRepo: PersonalRepository,
  ) {}

  list() {
    return this.repo
      .createQueryBuilder('b')
      .orderBy('b.is_favorite', 'DESC')
      .addOrderBy('b.created_at', 'DESC')
      .getMany();
  }

  async create(dto: CreateBookmarkDto) {
    const personal = await this.personalRepo.getSingleton();
    const entity = this.repo.create({
      url: dto.url,
      title: dto.title ?? '',
      note: dto.note ?? '',
      tags: dto.tags ?? [],
      is_favorite: dto.is_favorite ?? false,
      personal_id: personal?.id ?? null,
    });
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateBookmarkDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Bookmark not found');
    await this.repo.update({ id }, dto);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.repo.delete({ id });
    return { success: true };
  }
}
