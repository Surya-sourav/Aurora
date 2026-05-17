import { Controller , Delete, Get , Post, Put , Logger, Body, Param , Query, Patch } from "@nestjs/common";

import { BlogService } from "./blog.service";
import { createArticleDto, UpdateArticleDto } from "./request.dto";


@Controller('blog')
export class BlogController
{
    constructor(private readonly blogService : BlogService ){
    }


  /* The API Endpoints for the blog will be : 
    1. GET list of artciles ( filters such as publishing date or tags 
    2. GET Single Article , specified the ID of the Article
    3. POST a new article to the published 
    4. DELETE a single Article specified by the ID 
    5. update a single article based on the specified ID 
*/ 

    @Get('')
    async getArticles()
    {
        // Implementation of the Get Endpoint for fetching all the articles from the DB 
        const articles = await this.blogService.getArticles();
        
        return{
            success : true,
            Articles : articles
        };
    }

    @Get(':id')
    async getSingleArticle( @Param('id') id : number){
        
        // Fetch a single article 
        const article = await this.blogService.getArticlebyID(id);
        return {
            success : true,
            article
        }
    }

    @Post('')
    async postArticle(@Body() createArticleDto : createArticleDto)
    {
       const response =  await this.blogService.postArticle(createArticleDto);

        return {
            success : true,
            response
        }
    }

    @Delete(':id')
    async deleteArticle(@Param('id') id : number)
    {
        const response = await this.blogService.deleteArticlebyId(id);
        return response;
    }

    
    @Patch(':id')
    async updateArticle( @Body() updateArticleDto : UpdateArticleDto , @Param('id')id : number ) 
    {
        //Update the Article 
        const result = await this.blogService.updateArticlebyId(id , updateArticleDto);
    
        if(result) 
            { return {
            success : true,
        }
    }
    }

}