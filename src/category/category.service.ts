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

  async findByPage(page: number = 1, pageSize: number = 10) {
    const [items, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createAt: 'DESC'
      }
    });

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

  
}
