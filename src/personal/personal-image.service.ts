import { Injectable, NotFoundException } from '@nestjs/common';
import { PersonalImageRepository } from './personal-image.repository';
import { PersonalRepository } from './personal.repository';
import { UpdatePersonalImageDto } from './dto/personal-image.dto';

@Injectable()
export class PersonalImageService {
  constructor(
    private readonly repo: PersonalImageRepository,
    private readonly personalRepo: PersonalRepository,
  ) {}

  getBytes(id: string) {
    return this.repo.findWithBytes(id);
  }

  async create(file: Express.Multer.File, alt_text: string) {
    const personal = await this.personalRepo.getSingleton();
    if (!personal) throw new NotFoundException('Personal not initialized');
    const sort_order = await this.repo.nextSortOrder(personal.id);
    return this.repo.create({
      data: file.buffer,
      mime_type: file.mimetype,
      size_bytes: file.size,
      alt_text,
      sort_order,
      personal_id: personal.id,
    });
  }

  update(id: string, dto: UpdatePersonalImageDto) {
    return this.repo.update(id, dto);
  }

  remove(id: string) {
    return this.repo.remove(id);
  }
}
