import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "../entities/article.entity";
import { Repository } from "typeorm";
import convert from "../utils/convert";
import axios from 'axios';


@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository:Repository<Article>
  ){}

  findAllArticles(){
    return this.articleRepository.find()
  }

  async findByPage(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [articles, total] = await this.articleRepository.findAndCount({
      relations: ['tags', 'category','comments'],
      skip,
      take: pageSize,
      order: { createAt: 'DESC' }
    });

    const items = articles.map(({comments,...article}) => ({
      ...article,
      categoryName: article.category?.categoryName,
      tagNames: article.tags?.map(tag => tag.tagName),
      commentsCount: comments.length,
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
      articleMessage: await (await axios.get(article.articleMessage)).data,
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

  async createArticle(createArticleDto: {
    articleTitle: string;
    articleLabel: string;
    articleImg: string;
    articleMessage: string;
    categoryId: number;
    tags: number[];
  }) {
    const article = this.articleRepository.create({
      articleTitle: createArticleDto.articleTitle,
      articleLabel: createArticleDto.articleLabel,
      articleImg: createArticleDto.articleImg,
      articleMessage: createArticleDto.articleMessage,
      categoryId: createArticleDto.categoryId,
      tags: createArticleDto.tags.map(id => ({ tagId: id }))
    });

    await this.articleRepository.save(article);
    return {msg:'发布成功',type:'success'};
  }

  async updateArticle(
    articleId: number,
    updateArticleDto: {
      articleTitle?: string;
      articleLabel?: string;
      articleImg?: string;
      articleMessage?: string;
      categoryId?: number;
      tags?: number[];
    }
  ) {
    const article = await this.articleRepository.findOne({
      where: { articleId },
      relations: ['tags']
    });

    if (!article) {
      throw new Error('文章不存在');
    }

    // 更新基本字段
    if (updateArticleDto.articleTitle) article.articleTitle = updateArticleDto.articleTitle;
    if (updateArticleDto.articleLabel) article.articleLabel = updateArticleDto.articleLabel;
    if (updateArticleDto.articleImg) article.articleImg = updateArticleDto.articleImg;
    if (updateArticleDto.articleMessage) article.articleMessage = updateArticleDto.articleMessage;
    if (updateArticleDto.categoryId) article.categoryId = updateArticleDto.categoryId;

    // 更新标签关系
    if (updateArticleDto.tags) {
      article.tags = updateArticleDto.tags.map(id => ({ tagId: id } as any));
    }

    await this.articleRepository.save(article);
    return { msg: '更新成功', type: 'success' };
  }
}
