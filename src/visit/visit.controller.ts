import { Controller, Get, Post, Body,Query,DefaultValuePipe,ParseIntPipe,Req} from '@nestjs/common';
import { VisitService } from './visit.service';
import { Request } from 'express';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Get('count')
  async getVisitNumber() {
    const count = await this.visitService.getVisitCount();
    return count;
  }

  @Get()
  async getVisit(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    const result = await this.visitService.getVisit(page, pageSize);
    return result;
  }
  
  @Get('detail')
  async getVisitDetail() {
    const result = await this.visitService.getVisitDetail();
    return result;
  }

  @Post()
    async createVisit(
    @Body() body: { flag: boolean; browser: string; device: string; city: string | null },
    @Req() req: Request
  ) {

    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];

    const clientIp =
      (typeof forwarded === 'string' && forwarded.split(',')[0].trim()) ||
      (typeof realIp === 'string' && realIp.trim()) ||
      req.socket?.remoteAddress ||
      '';

    const visit = await this.visitService.createVisitRecord(clientIp, body.browser, body.device, body.city, body.flag);
    return { ip: clientIp, map: visit.location ? { city: visit.location } : {} };
  }
}
