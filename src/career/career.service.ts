import { Injectable, NotFoundException } from '@nestjs/common';
import { CareerRepository } from './career.repository';
import { PersonalRepository } from 'src/personal/personal.repository';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@Injectable()
export class CareerService {
  constructor(
    private readonly repo: CareerRepository,
    private readonly personalRepo: PersonalRepository,
  ) {}

  list() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Career entry not found');
    return item;
  }

  async create(dto: CreateCareerDto) {
    const personal = await this.personalRepo.getSingleton();
    return this.repo.create({
      company_name: dto.company_name,
      job_title: dto.job_title,
      company_url: dto.company_url ?? '',
      employment_type: dto.employment_type ?? '',
      location: dto.location ?? '',
      description: dto.description ?? '',
      start_date: dto.start_date,
      end_date: dto.end_date ?? null,
      personal_id: personal?.id ?? null,
    });
  }

  update(id: string, dto: UpdateCareerDto) {
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    await this.repo.remove(id);
    return { success: true };
  }

  getLogo(id: string) {
    return this.repo.findLogo(id);
  }

  setLogo(id: string, file: Express.Multer.File) {
    return this.repo.update(id, {
      logo: file.buffer,
      logo_mime: file.mimetype,
    });
  }

  removeLogo(id: string) {
    return this.repo.update(id, { logo: null, logo_mime: '' });
  }
}
