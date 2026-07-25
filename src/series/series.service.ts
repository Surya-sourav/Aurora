import { Injectable, NotFoundException } from '@nestjs/common';
import { SeriesRepository } from './series.repository';
import { PersonalRepository } from 'src/personal/personal.repository';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { generateUniqueSlug, toSlug } from 'src/common/utils/slug';

@Injectable()
export class SeriesService {
  constructor(
    private readonly repo: SeriesRepository,
    private readonly personalRepo: PersonalRepository,
  ) {}

  async list() {
    const items = await this.repo.findAll();
    return items;
  }

  async getBySlug(slug: string) {
    const series = await this.repo.findBySlug(slug);
    if (!series) throw new NotFoundException('Series not found');
    const posts = await this.repo.postsInSeries(series.id);
    return { series, posts };
  }

  async getById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Series not found');
    return item;
  }

  async create(dto: CreateSeriesDto) {
    const personal = await this.personalRepo.getSingleton();
    const source = dto.slug || dto.name;
    const slug = await generateUniqueSlug(source, (s) => this.repo.slugExists(s));
    return this.repo.create({
      name: dto.name,
      slug,
      description: dto.description ?? '',
      sort_order: dto.sort_order ?? 0,
      personal_id: personal?.id ?? null,
    });
  }

  async update(id: string, dto: UpdateSeriesDto) {
    const existing = await this.getById(id);
    const patch: Record<string, unknown> = {};
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.description !== undefined) patch.description = dto.description;
    if (dto.sort_order !== undefined) patch.sort_order = dto.sort_order;
    if (dto.slug && dto.slug !== existing.slug) {
      const newSlug = toSlug(dto.slug);
      if (newSlug !== existing.slug && (await this.repo.slugExists(newSlug))) {
        patch.slug = await generateUniqueSlug(newSlug, (s) => this.repo.slugExists(s));
      } else {
        patch.slug = newSlug;
      }
    }
    return this.repo.update(id, patch);
  }

  async remove(id: string) {
    await this.repo.remove(id);
    return { success: true };
  }
}
