import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, Repository } from "typeorm";
import { Visit } from "../entities/visit.entity";
import axios from 'axios';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
  ) {}

  findAll() {
    return this.visitRepository.find();
  }

  getCount() {
    return this.visitRepository.count();
  }

  async getVisitCount() {
    return this.visitRepository.count();
  }

  async getVisitDetail() {
    // 获取总访问量
    const totalCount = await this.visitRepository.count();
    // 计算六天前的日期
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    // 获取最近六天的访问记录
    const recentVisits = await this.visitRepository
      .createQueryBuilder('visit')
      .where('visit.createAt >= :sixDaysAgo', { sixDaysAgo })
      .orderBy('visit.createAt', 'DESC')
      .getMany();
  
    return [totalCount, recentVisits];
  }

  async createVisitRecord(clientIp: string, browser: string, device: string, city: string | null, flag: boolean) {
    let location = city;
    const key = "7d6832561c0c30f258321059a09aab0e";

    if (flag) {
      try {
        const response = await axios.get("https://restapi.amap.com/v3/ip?parameters", {
          params: {
            key,
            ip: clientIp
          }
        });
        location = response.data.city;
      } catch (error) {
        console.error('Error getting location from Amap API:', error);
      }
    }

    const visit = this.visitRepository.create({
      location,
      browser,
      clientIp,
      device
    });

    return this.visitRepository.save(visit);
  }
}
