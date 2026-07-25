import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { PersonalRepository } from 'src/personal/personal.repository';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { generateUniqueSlug } from 'src/common/utils/slug';
import { viewDebouncer } from 'src/common/utils/view-debounce';

@Injectable()
export class NotesService {
  constructor(
    private readonly repo: NotesRepository,
    private readonly personalRepo: PersonalRepository,
  ) {}

  list() {
    return this.repo.findAll();
  }

  async getBySlug(slug: string) {
    const item = await this.repo.findBySlug(slug);
    if (!item) throw new NotFoundException('Note not found');
    return item;
  }

  async maybeIncrementViews(id: string, fingerprint: string, isAdmin: boolean) {
    if (isAdmin) return;
    if (!viewDebouncer.shouldCount(`note:${id}`, fingerprint)) return;
    await this.repo.incrementViewCount(id);
  }

  async create(dto: CreateNoteDto) {
    const personal = await this.personalRepo.getSingleton();
    const slug = await generateUniqueSlug(
      dto.slug || dto.heading,
      (s) => this.repo.slugExists(s),
    );
    return this.repo.create({
      heading: dto.heading,
      slug,
      body: dto.body,
      tags: dto.tags ?? [],
      personal_id: personal?.id ?? null,
    });
  }

  update(id: string, dto: UpdateNoteDto) {
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    await this.repo.remove(id);
    return { success: true };
  }
}
