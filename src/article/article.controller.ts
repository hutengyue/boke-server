import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  findAll(){
    return this.articleService.findAll()
  }
}
