import { Controller, Get, Post, Body, Patch, Param, Delete,ParseIntPipe } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  findAllArticles(){
    return this.articleService.findAllArticles()

  }

  @Post()
  findByArticleId(@Body() body:any){
    return this.articleService.findByArticleId(body.articleId)
  }

  @Get('page')
  findByPage(@Body() body: { page?: number; limit?: number }) {
    return this.articleService.findByPage(body.page, body.limit);
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

  @Post(':id/heat')
  async incrementHeat(@Param('id', ParseIntPipe) articleId: number) {
    const heat = await this.articleService.incrementHeat(articleId);
    return { heat };
  }
}
