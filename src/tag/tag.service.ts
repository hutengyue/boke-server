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

  async findAll() {
    let tags = await this.tagRepository.find({
      relations: ['articles']
    })
    const result = tags.map(tag => ({
      ...tag,
      number:tag.articles.length
    }));
    return result
  }

  async getArticles(tagName: string) {
    let result = await this.tagRepository.createQueryBuilder("tag")
      .leftJoinAndSelect("tag.articles", "article")
      .where("tag.tagName = :tagName", {tagName: tagName})
      .getMany();
    return result
  }
}
