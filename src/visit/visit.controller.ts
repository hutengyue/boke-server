import { Controller, Get, Post, Body,Query,DefaultValuePipe,ParseIntPipe} from '@nestjs/common';
import { VisitService } from './visit.service';

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
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.visitService.getVisit(page, limit);
    return result;
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
