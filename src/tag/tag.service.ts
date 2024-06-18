import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tag } from "../entities/tag.entity";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  findAll() {
    return this.tagRepository.find({
      relations: ['articles']
    })
  }

  getArticles(tagId:number){
    let tag = this.tagRepository.createQueryBuilder("tag")
    .leftJoinAndSelect("tag.articles", "article")
    .where("tag.tagId = :tagId", { tagId:1 })
    .getOne();
    return tag
  }
}
