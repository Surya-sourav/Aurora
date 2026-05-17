import { Blog } from "src/database/entities/blog.entity";
import { BaseRepository } from "src/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

Injectable()
export class BlogRepository {

    constructor(
        @InjectRepository(Blog)
        private blogrepository : Repository<Blog>
    ) {}


    async getArticles() 
        {
            return this.blogrepository.find();

        }
    
    async getArticleById(blogid : number) : Promise<any>
    {
        return this.blogrepository.findOne({
            where : {
                id : blogid
            }
        })
    }

    async postArticle(data) : Promise<any>{

       const article = this.blogrepository.create(data)
       return this.blogrepository.save(article);
       

    }

    async deleteArticle(articleid : number) : Promise<any> {
        return this.blogrepository.delete({
            id : articleid
        })
    }

    async updateArticle(articleId : number , data) : Promise<any>
    {
        const updated = this.blogrepository.update(
            {
                id : articleId,
            
            },
            data
        );

        return updated;
    }

}