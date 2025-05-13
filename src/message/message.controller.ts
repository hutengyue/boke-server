import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from "../guard/jwt.guard";
import type { Request } from "express";

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  findAll(){
    return this.messageService.findAll()
  }

  @Get('page')
  async findByPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.messageService.findByPage(page, limit);
  }

  @UseGuards(JwtGuard)
  @Post('send')
  async sendMessage(
    @Req() req: Request,
    @Body() body: { content: string }
  ) {
    const userId = (req.user as { userId: number }).userId;
    return await this.messageService.sendMessage(userId, body.content);
  }
}
