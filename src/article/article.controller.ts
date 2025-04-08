import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  findAll(){
    return this.articleService.findAll()

  }

  @Post()
  findOne(@Body() body:any){
    return this.articleService.findOne(body.articleId)
  }

  @Post('searchByCategory')
  findByCategory(@Body() body:any){
    return this.articleService.findByCategory(body.categoryId,body.pageNo,body.pageSize)
  }

  @Post('searchByArticleId')
  findByArticle(@Body() articleId:number){

  }

  @Get('count')
  getCount(){
    return this.articleService.getCount()
  }
}
