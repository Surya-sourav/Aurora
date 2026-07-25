import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminUser } from './database/entities/admin-user.entity';
import { Blog } from './database/entities/blog.entity';
import { BlogRevision } from './database/entities/blog-revision.entity';
import { Bookmark } from './database/entities/bookmark.entity';
import { Career } from './database/entities/career.entity';
import { Category } from './database/entities/category.entity';
import { Image } from './database/entities/image.entity';
import { Note } from './database/entities/note.entity';
import { Personal } from './database/entities/personal.entity';
import { PersonalImage } from './database/entities/personal-image.entity';
import { Series } from './database/entities/series.entity';

import { AiModule } from './ai/ai.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { CareerModule } from './career/career.module';
import { CategoryModule } from './category/category.module';
import { FeedsModule } from './feeds/feeds.module';
import { ImageModule } from './image/image.module';
import { NotesModule } from './notes/notes.module';
import { PersonalModule } from './personal/personal.module';
import { SeriesModule } from './series/series.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT ?? '5432', 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: [
        Personal,
        PersonalImage,
        Blog,
        BlogRevision,
        Image,
        AdminUser,
        Career,
        Category,
        Series,
        Note,
        Bookmark,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.DB_LOGGING === 'true',
      ssl: { rejectUnauthorized: false },
    }),
    AuthModule,
    BootstrapModule,
    PersonalModule,
    BlogModule,
    CareerModule,
    CategoryModule,
    SeriesModule,
    NotesModule,
    BookmarksModule,
    ImageModule,
    FeedsModule,
    AnalyticsModule,
    AiModule,
  ],
})
export class AppModule {}
