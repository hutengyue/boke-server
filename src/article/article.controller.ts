import { Controller, Get, Post, Body, Patch, Param, Delete,ParseIntPipe,
  Query,DefaultValuePipe} from '@nestjs/common';
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
  findByPage(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number) {
    return this.articleService.findByPage(page,pageSize);
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

  @Post('create')
  async createArticle(@Body() createArticleDto: {
    articleTitle: string;
    articleLabel: string;
    articleImg: string;
    articleMessage: string;
    categoryId: number;
    tags: number[];
  }) {
    return this.articleService.createArticle(createArticleDto);
  }

  @Patch(':id')
  async updateArticle(
    @Param('id', ParseIntPipe) articleId: number,
    @Body() updateArticleDto: {
      articleTitle?: string;
      articleLabel?: string;
      articleImg?: string;
      articleMessage?: string;
      categoryId?: number;
      tags?: number[];
    }
  ) {
    return this.articleService.updateArticle(articleId, updateArticleDto);
  }
}
