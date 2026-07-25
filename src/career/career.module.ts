import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from 'src/database/entities/career.entity';
import { CareerController } from './career.controller';
import { CareerService } from './career.service';
import { CareerRepository } from './career.repository';
import { PersonalModule } from 'src/personal/personal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Career]), PersonalModule],
  controllers: [CareerController],
  providers: [CareerService, CareerRepository],
  exports: [CareerService],
})
export class CareerModule {}
