import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "../entities/article.entity";
import { Repository } from "typeorm";
import convert from "../utils/convert";


@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository:Repository<Article>
  ){}

  findAll(){
    return this.articleRepository.find()
  }

  async findByCategory(categoryId: number,pageNo:number,pageSize:number) {
    const skip = (pageNo - 1) * pageSize;
    let articles = await this.articleRepository.find({
      where:{categoryId:categoryId},
      relations: ['tags','category'],
      skip,
      take: pageSize
    })
    let result = articles.map(article=>({
      ...article,
      articleImg:convert(article.articleImg)
    }))
    return result
  }

  findByArticle(articleId:number){

  }

  getCount(){
    return this.articleRepository.count()
  }
}
