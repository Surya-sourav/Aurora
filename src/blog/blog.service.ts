import { Injectable, ParseIntPipe } from "@nestjs/common";
import { BlogRepository } from "./blog.repository";



@Injectable()
export class BlogService {

    constructor(private blogRepository : BlogRepository){}


    async getArticles() : Promise<any> {

        const articles = this.blogRepository.getArticles();
        return articles;
    }


    async postArticle(data) : Promise<any> {
        const article = this.blogRepository.postArticle(data);
        return article;
    }


    async getArticlebyID(id : number) : Promise<any>{

        const article = this.blogRepository.getArticleById(id);

        return article;
    }

    async deleteArticlebyId(id : number) : Promise<any>
    {
        const approval = await this.blogRepository.deleteArticle(id);
        if(approval)
        {
            return {
                success : true,
            }
        }
    }

    async updateArticlebyId(id : number , data ) : Promise<any>
    {
        const confirmation = await this.blogRepository.updateArticle(id , data);

        return confirmation;
    }
}