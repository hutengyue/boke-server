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

  async getArticleComments(articleId: number, page: number, pageSize: number) {
    const [comments, total] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.replies', 'replies', 'replies.toId = comment.commentId')
      .leftJoinAndSelect('replies.user', 'replyUser')
      .leftJoinAndSelect('replies.parent', 'parentComment')
      .leftJoinAndSelect('parentComment.user', 'parentUser')
      .where('comment.articleId = :articleId', { articleId })
      .andWhere('comment.toId IS NULL')  // 只获取顶层评论
      .orderBy('comment.createAt', 'DESC')
      .addOrderBy('replies.createAt', 'ASC')  // 回复按时间正序，这样第一条回复就是最早的
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const formattedComments = comments.map(comment => {
      const { user, article, replies, ...commentData } = comment;
      return {
        ...commentData,
        username: user.username,
        headImg: user.headImg,
        replies: replies ? replies.map(reply => {
          const { user: replyUser, article: replyArticle, parent, ...replyData } = reply;
          return {
            ...replyData,
            username: replyUser.username,
            headImg: replyUser.headImg,
            replyToUsername: parent.user.username
          };
        }) : []
      };
    });

    return {
      items: formattedComments,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async getAllComments(page: number, pageSize: number) {
    const [comments, total] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.replies', 'replies', 'replies.toId = comment.commentId')
      .leftJoinAndSelect('replies.user', 'replyUser')
      .leftJoinAndSelect('replies.parent', 'parentComment')
      .leftJoinAndSelect('parentComment.user', 'parentUser')
      .orderBy('comment.createAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const formattedComments = comments.map(comment => {
      const { user, article, replies, ...commentData } = comment;
      return {
        ...commentData,
        username: user.username,
        headImg: user.headImg,
        articleTitle: article.articleTitle,
        replies: replies ? replies.map(reply => {
          const { user: replyUser, ...replyData } = reply;
          return {
            ...replyData,
            username: replyUser.username,
            headImg: replyUser.headImg
          };
        }) : []
      };
    });

    return {
      items: formattedComments,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

}
