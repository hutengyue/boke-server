import { Body, Post, Controller, Get, Query,DefaultValuePipe,ParseIntPipe } from '@nestjs/common';
import { PmessageService } from './pmessage.service';

@Controller('pmessage')
export class PmessageController {
  constructor(private readonly pmessageService: PmessageService) {}
  
  @Post('send')
  async send(@Body() body:any){
    const {fromId,toId,message} = body
    return this.pmessageService.createMessage(fromId,toId,message)
  }

  @Get('history')
  async getChatHistory(
    @Query('userId1') userId1: number,
    @Query('userId2') userId2: number,
    @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.pmessageService.getChatHistory(+userId1, +userId2,pageNo, pageSize);
  }
}
