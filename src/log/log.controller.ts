import { Controller, Get, Post, Body, Patch, Param, Delete,DefaultValuePipe,ParseIntPipe,Query } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}
  @Get('all')
  findAll(){
    return this.logService.findAll()
  }

  @Get()
  async findByPage(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
  return this.logService.findByPage(page, limit);
  }
}
