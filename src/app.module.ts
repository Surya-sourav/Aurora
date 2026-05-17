import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminUser } from './database/entities/admin-user.entity';
import { Blog } from './database/entities/blog.entity';
import { Image } from './database/entities/image.entity';
import { Personal } from './database/entities/personal.entity';
import { PersonalImage } from './database/entities/personal-image.entity';

import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { FeedsModule } from './feeds/feeds.module';
import { ImageModule } from './image/image.module';
import { PersonalModule } from './personal/personal.module';

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
      entities: [Personal, PersonalImage, Blog, Image, AdminUser],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.DB_LOGGING === 'true',
      ssl: { rejectUnauthorized: false },
    }),
    AuthModule,
    BootstrapModule,
    PersonalModule,
    BlogModule,
    ImageModule,
    FeedsModule,
  ],
})
export class AppModule {}
