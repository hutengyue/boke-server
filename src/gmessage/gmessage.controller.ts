import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { GmessageService } from './gmessage.service';

@Controller('gmessage')
export class GmessageController {
  constructor(private readonly gmessageService: GmessageService) {}

  @Get('user/:userId/latest')
  async getUserGroupsLatestMessages(@Param('userId') userId: string) {
    return await this.gmessageService.getUserGroupsLatestMessages(+userId);
  }

  @Get('group/:groupId')
  async getGroupMessages(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return await this.gmessageService.find(pageNo, pageSize, groupId);
  }
}
