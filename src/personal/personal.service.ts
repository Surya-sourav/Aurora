import { Injectable, NotFoundException } from '@nestjs/common';
import { PersonalRepository } from './personal.repository';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { viewDebouncer } from 'src/common/utils/view-debounce';

@Injectable()
export class PersonalService {
  constructor(private readonly repo: PersonalRepository) {}

  async getPersonal() {
    const personal = await this.repo.getSingleton();
    if (!personal) throw new NotFoundException('Personal not initialized');
    personal.images = (personal.images ?? []).sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    return personal;
  }

  async maybeIncrementViews(
    id: string,
    fingerprint: string,
    isAdmin: boolean,
  ) {
    if (isAdmin) return;
    if (!viewDebouncer.shouldCount(`personal:${id}`, fingerprint)) return;
    await this.repo.incrementViews(id);
  }

  update(id: string, dto: UpdatePersonalDto) {
    return this.repo.update(id, dto);
  }
}
