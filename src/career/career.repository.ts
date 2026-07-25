import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from 'src/database/entities/career.entity';

@Injectable()
export class CareerRepository {
  constructor(
    @InjectRepository(Career) private readonly repo: Repository<Career>,
  ) {}

  findAll() {
    return this.repo
      .createQueryBuilder('c')
      .orderBy('c.end_date', 'DESC', 'NULLS FIRST')
      .addOrderBy('c.start_date', 'DESC')
      .getMany();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findLogo(id: string) {
    return this.repo
      .createQueryBuilder('c')
      .select(['c.id', 'c.logo_mime'])
      .addSelect('c.logo')
      .where('c.id = :id', { id })
      .getOne();
  }

  async create(data: Partial<Career>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, patch: Partial<Career>) {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  remove(id: string) {
    return this.repo.delete({ id });
  }
}
