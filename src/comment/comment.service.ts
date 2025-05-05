import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async submitComment(userId: number, articleId: number, message: string) {
    const comment = this.commentRepository.create({
      userId,
      articleId,
      message,
    });

    await this.commentRepository.save(comment);
    return comment;
  }
  
  async replyComment(userId: number, articleId: number, parentId: number, message: string) {
    const comment = this.commentRepository.create({
      userId,
      articleId,
      message,
      toId: parentId
    });

    await this.commentRepository.save(comment);
    return comment;
  }

  async getArticleComments(articleId: number, page: number, limit: number) {
    // ... existing code ...

    const [comments, total] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.replies', 'replies', 'replies.toId = comment.commentId')
      .leftJoinAndSelect('replies.user', 'replyUser')
      .where('comment.articleId = :articleId', { articleId })
      .andWhere('comment.toId IS NULL')  // 只获取顶层评论
      .orderBy('comment.createAt', 'DESC')
      .addOrderBy('replies.createAt', 'ASC')  // 回复按时间正序，这样第一条回复就是最早的
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const formattedComments = comments.map(comment => ({
      ...comment,
      username: comment.user.username,
      headImg: comment.user.headImg,
      replies: comment.replies ? comment.replies.map(reply => ({
        ...reply,
        username: reply.user.username,
        headImg: reply.user.headImg
      })) : []
    }));

    return {
      items: formattedComments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

}
