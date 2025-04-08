import { Controller, Get, Post, Body } from '@nestjs/common';
import { VisitService } from './visit.service';

@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Get('number')
  async getVisitNumber() {
    const count = await this.visitService.getVisitCount();
    return count;
  }

  @Get('detail')
  async getVisitDetail() {
    const result = await this.visitService.getVisitDetail();
    return result;
  }

  @Post()
  async createVisit(@Body() body: { flag: boolean; browser: string; device: string; city: string | null }) {
    const clientIp = "112.10.191.62";
    const visit = await this.visitService.createVisitRecord(clientIp, body.browser, body.device, body.city, body.flag);
    return { ip: clientIp, map: visit.location ? { city: visit.location } : {} };
  }
}
