import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from 'src/database/entities/admin-user.entity';
import { Personal } from 'src/database/entities/personal.entity';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser, Personal])],
  providers: [BootstrapService],
})
export class BootstrapModule {}
