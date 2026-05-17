import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "src/database/entities/blog.entity";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { BlogRepository } from "./blog.repository";

@Module({
    imports : [TypeOrmModule.forFeature([Blog])],
    controllers : [BlogController],
    providers : [BlogService , BlogRepository],
    exports : [BlogService]

})

export class BlogModule {}