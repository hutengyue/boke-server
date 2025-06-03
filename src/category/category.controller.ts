import { Controller, Get, Post, Body, Patch, Param, Delete,Query,DefaultValuePipe,ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  findAll(){
    return this.categoryService.findAll()
  }

  @Post('')
  findOne(@Body('categoryId') categoryId: number){
    return this.categoryService.findOne(categoryId)
  }

  @Get('page')
  findByPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.categoryService.findByPage(page, pageSize);
  }
}
