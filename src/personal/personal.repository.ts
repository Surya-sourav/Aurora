import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personal } from 'src/database/entities/personal.entity';

@Injectable()
export class PersonalRepository {
  constructor(
    @InjectRepository(Personal) private readonly repo: Repository<Personal>,
  ) {}

  getSingleton() {
    return this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'img')
      .orderBy('p.created_at', 'ASC')
      .addOrderBy('img.sort_order', 'ASC')
      .getOne();
  }

  async update(id: string, patch: Partial<Personal>) {
    await this.repo.update({ id }, patch);
    return this.getSingleton();
  }

  async incrementViews(id: string) {
    await this.repo.increment({ id }, 'portfolio_view_count', 1);
  }
}
