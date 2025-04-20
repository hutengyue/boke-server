import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { User } from "../entities/user.entity";

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(){
    return this.tagService.findAll()
  }

  @Post('articles')
  getArticles(@Body() body:any){
    return this.tagService.getArticles(body.tagId)
  }

}
