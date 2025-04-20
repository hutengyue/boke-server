import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "../entities/article.entity";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from 'path';
import convert from "../utils/convert";


@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository:Repository<Article>
  ){}

  findAllArticles(){
    return this.articleRepository.find()
  }

  async findByArticleId(articleId:number) {
    let article = await this.articleRepository.findOne({
      where: {articleId: articleId},
      relations: ['tags', 'category'],
      select: {
        category: {
          categoryName: true
        },
        tags: {
          tagName: true
        }
      }
    });

    let result = {
      ...article,
      articleImg: convert(article.articleImg),
      articleMessage: fs.readFileSync(path.join('./public/',article.articleMessage),'utf-8'),
      categoryName: article.category?.categoryName,
      tagNames: article.tags?.map(tag => tag.tagName)
    }
    return result;
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

  getCount(){
    return this.articleRepository.count()
  }

  async incrementHeat(articleId: number) {
    const article = await this.articleRepository.findOneBy({ articleId });
    if (!article) {
      throw new Error('文章不存在');
    }

    article.heat += 1;
    await this.articleRepository.save(article);
  }
}
