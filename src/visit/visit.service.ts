import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Visit } from "../entities/visit.entity";

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
  ) {}
  findAll(){
    return this.visitRepository.find()
  }
  getCount(){
    return this.visitRepository.count()
  }
}
