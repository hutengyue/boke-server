import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "../entities/article.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository:Repository<Article>
  ){}
  findAll(){
    return this.articleRepository.find()
  }
}
