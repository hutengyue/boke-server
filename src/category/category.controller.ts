import { Controller, Get, Post, Body, Patch, Param, Delete,Query,DefaultValuePipe,ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  findAll(){
    return this.categoryService.findAll()
  }

  @Get(':categoryId')
  findOne(@Param('categoryId') categoryId: number){
    return this.categoryService.findOne(categoryId)
  }

  @Get('page')
  findByPage(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
            @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number) {
    console.log(page,pageSize)
    return this.categoryService.findByPage(page, pageSize);
  }

  // @Get(':categoryId')
  // getArticles(@Param('categoryId') categoryId: number){
  //   return this.categoryService.getArticles(categoryId)
  // }
}
