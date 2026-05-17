import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './database/entities/blog.entity';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : '.env',
      isGlobal : true
    }),

    TypeOrmModule.forRoot({
     
      type : 'postgres',
      host : process.env.PGHOST,
      port : 5432,
      password : process.env.PGPASSWORD,
      username : process.env.PGUSER,
      entities : [Blog],
      database : process.env.PGDATABASE,
      synchronize : true,
      logging : true,
      ssl : true,

    }),
    BlogModule,
],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
