import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Log } from "../entities/log.entity";

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}
  findAll(){
    return this.logRepository.find()
  }

  async findByPage(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await this.logRepository.findAndCount({
      skip,
      take: pageSize,
      order: { createAt: 'DESC' }
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
}
