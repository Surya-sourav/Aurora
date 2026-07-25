import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { PersonalRepository } from 'src/personal/personal.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { generateUniqueSlug, toSlug } from 'src/common/utils/slug';

@Injectable()
export class CategoryService {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly personalRepo: PersonalRepository,
  ) {}

  async list() {
    const items = await this.repo.findAll();
    const counts = await this.repo.countsBySlug();
    const countMap = new Map(counts.map((c) => [c.slug, c.count]));
    return items.map((c) => ({ ...c, post_count: countMap.get(c.slug) ?? 0 }));
  }

  async getById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Category not found');
    return item;
  }

  async create(dto: CreateCategoryDto) {
    const personal = await this.personalRepo.getSingleton();
    const source = dto.slug || dto.name;
    const slug = await generateUniqueSlug(source, (s) => this.repo.slugExists(s));
    return this.repo.create({
      name: dto.name,
      slug,
      description: dto.description ?? '',
      color: dto.color ?? '',
      sort_order: dto.sort_order ?? 0,
      personal_id: personal?.id ?? null,
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.getById(id);
    const patch: Record<string, unknown> = {};
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.description !== undefined) patch.description = dto.description;
    if (dto.color !== undefined) patch.color = dto.color;
    if (dto.sort_order !== undefined) patch.sort_order = dto.sort_order;
    if (dto.slug !== undefined && dto.slug !== existing.slug) {
      const newSlug = toSlug(dto.slug);
      if (newSlug !== existing.slug && (await this.repo.slugExists(newSlug))) {
        throw new ConflictException('slug already in use');
      }
      patch.slug = newSlug;
    }
    return this.repo.update(id, patch);
  }

  async remove(id: string) {
    await this.repo.remove(id);
    return { success: true };
  }
}
