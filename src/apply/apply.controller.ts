import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApplyService } from './apply.service';

@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post()
  async createApply(@Body() applyData: { fromId: number; toId: number }) {
    console.log(applyData)
    return await this.applyService.createApply(applyData.fromId, applyData.toId);
  }

  @Get()
  async getApplies(@Query('userId') userId: number) {
    return await this.applyService.getApplies(userId);
  }

  @Post('handle')
  async handleApply(@Body() body: { applyId: number; status: 'yes' | 'no' }) {
    return await this.applyService.handleApply(body.applyId, body.status);
  }
}
