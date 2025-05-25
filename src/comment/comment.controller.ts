import { Controller, Post, Body, UseGuards, Req ,Get,DefaultValuePipe,Query,ParseIntPipe} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from "../guard/jwt.guard";
import type { Request } from "express";

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  //提交评论
  @UseGuards(JwtGuard)
  @Post('submit')
  async submitComment(
    @Req() req: Request,
    @Body() body: { message: string; articleId: number }
  ) {
    const userId = (req.user as { userId: number }).userId;
    return await this.commentService.submitComment(
      userId,
      body.articleId,
      body.message
    );
  }
  //回复评论
  @UseGuards(JwtGuard)
  @Post('reply')
  async replyComment(
    @Req() req: Request,
    @Body() body: { 
      message: string; 
      articleId: number;
      parentId: number;  // 父评论ID
    }
  ) {
    const userId = (req.user as { userId: number }).userId;
    return await this.commentService.replyComment(
      userId,
      body.articleId,
      body.parentId,
      body.message
    );
  }
  //获取文章评论
  @Get('list')
  async getArticleComments(
    @Query('articleId', ParseIntPipe) articleId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return await this.commentService.getArticleComments(articleId, page, pageSize);
  }

  @Get('all')
  async getAllComments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return await this.commentService.getAllComments(page, pageSize);
  }
  
}
