import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ){}

  findAll(){
    return this.categoryRepository.find()
  }

  async getArticles(categoryId){
    let category = await this.categoryRepository.findOne({
      where:{ categoryId },
      relations:['articles']
    })
    return category.articles
  }
}
