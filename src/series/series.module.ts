import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Series } from 'src/database/entities/series.entity';
import { Blog } from 'src/database/entities/blog.entity';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { SeriesRepository } from './series.repository';
import { PersonalModule } from 'src/personal/personal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Blog]), PersonalModule],
  controllers: [SeriesController],
  providers: [SeriesService, SeriesRepository],
  exports: [SeriesService, SeriesRepository],
})
export class SeriesModule {}
