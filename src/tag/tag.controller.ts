import { Controller, Get, Post, Body, Patch, Param, Delete,Query,DefaultValuePipe,ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { User } from "../entities/user.entity";

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(){
    return this.tagService.findAll()
  }

  @Get('page')
  findByPage(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
            @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.tagService.findByPage(page, limit);
  }

  @Post('articles')
  getArticles(@Body() body:any){
    return this.tagService.getArticles(body.tagId)
  }

}
