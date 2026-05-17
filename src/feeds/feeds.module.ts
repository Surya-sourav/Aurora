import { Module } from '@nestjs/common';
import { BlogModule } from 'src/blog/blog.module';
import { PersonalModule } from 'src/personal/personal.module';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
  imports: [BlogModule, PersonalModule],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
