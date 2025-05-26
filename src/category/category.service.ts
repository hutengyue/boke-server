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

  // async getArticles(categoryId){
  //   let category = await this.categoryRepository.findOne({
  //     where:{ categoryId },
  //     relations:['articles']
  //   })
  //   return category.articles
  // }

  async findOne(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
      relations: [
        'articles',
        'articles.tags',
        'articles.comments',
        'articles.category'
      ]
    });

    if (category && category.articles) {
      category.articles = category.articles.map(article => ({
        ...article,
        commentsCount: article.comments?.length || 0,
        comments:[],
        categoryName: article.category?.categoryName || '',
      }));
    }

    return category;
  }


  async findByPage(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [tags, total] = await this.categoryRepository.findAndCount({
      relations: ['articles'],
      skip,
      take: pageSize,
      order: { createAt: 'DESC' }
    });

    const items = tags.map(tag => ({
      ...tag,
      number: tag.articles.length
    }));
    
    return {
      items,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
}
