import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personal } from 'src/database/entities/personal.entity';
import { PersonalImage } from 'src/database/entities/personal-image.entity';
import { PersonalController } from './personal.controller';
import { PersonalImageController } from './personal-image.controller';
import { PersonalService } from './personal.service';
import { PersonalImageService } from './personal-image.service';
import { PersonalRepository } from './personal.repository';
import { PersonalImageRepository } from './personal-image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Personal, PersonalImage])],
  controllers: [PersonalController, PersonalImageController],
  providers: [
    PersonalService,
    PersonalImageService,
    PersonalRepository,
    PersonalImageRepository,
  ],
  exports: [PersonalService, PersonalRepository],
})
export class PersonalModule {}
