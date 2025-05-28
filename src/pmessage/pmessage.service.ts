import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Pmessage } from '../entities/pmessage.entity';
import { User } from '../entities/user.entity';
import convertTime from 'src/utils/convertTime';

@Injectable()
export class PmessageService {
  constructor(
    @InjectRepository(Pmessage)
    private pmessageRepository: Repository<Pmessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createMessage(fromId: number, toId: number, message: string) {
    // 创建新的私聊消息
    const newMessage = this.pmessageRepository.create({
      fromId,
      toId,
      message,
    });
    await this.pmessageRepository.save(newMessage);

    // 获取发送者信息
    const sender = await this.userRepository.findOne({
      where: { userId: fromId },
      select: ['userId', 'username', 'headImg']
    });

    return {
        ...newMessage,
        createAt:convertTime(newMessage.createAt),
        user:{
            userId: sender.userId,
            username: sender.username,
            headImg: sender.headImg
        }
    };
  }

  async getChatHistory(userId1: number, userId2: number, pageNo: number, pageSize: number) {
    const skip = (pageNo - 1) * pageSize;

    const [messages, total] = await this.pmessageRepository.createQueryBuilder('pmessage')
      .leftJoinAndSelect('pmessage.from', 'from')
      .where(new Brackets(qb => {
        qb.where('pmessage.fromId = :userId1 AND pmessage.toId = :userId2', { userId1, userId2 })
          .orWhere('pmessage.fromId = :userId2 AND pmessage.toId = :userId1', { userId1, userId2 });
      }))
      .orderBy('pmessage.createAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    // 格式化消息数据
    const items = messages.map(({from, ...message}) => ({
      ...message,
      createAt: convertTime(message.createAt),
      user: {
        userId: from.userId,
        username: from.username,
        headImg: from.headImg
      }
    }));

    return {
      items,
      meta: {
        total,
        pageNo: pageNo,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
  

  async getLatestMessages(userId: number) {
    // 使用子查询获取每个对话的最新消息
    const latestMessages = await this.pmessageRepository
      .createQueryBuilder('pmessage')
      .distinctOn(['conversationGroup'])
      .addSelect(
        `CASE 
          WHEN pmessage.fromId = :userId THEN pmessage.toId 
          ELSE pmessage.fromId 
        END`,
        'conversationGroup'
      )
      .leftJoinAndSelect('pmessage.from', 'from')
      .leftJoinAndSelect(
        User,
        'otherUser',
        `CASE 
          WHEN pmessage.fromId = :userId THEN otherUser.userId = pmessage.toId 
          ELSE otherUser.userId = pmessage.fromId 
        END`
      )
      .where(new Brackets(qb => {
        qb.where('pmessage.fromId = :userId', { userId })
          .orWhere('pmessage.toId = :userId', { userId });
      }))
      .orderBy('conversationGroup', 'ASC')
      .addOrderBy('pmessage.createAt', 'DESC')
      .setParameter('userId', userId)
      .getMany();

    return latestMessages.map(message => ({
      friend: {
        userId: message.fromId === userId ? message.toId : message.fromId,
        username: message.from.username,
        headImg: message.from.headImg
      },
      message: message.message,
      createAt: convertTime(message.createAt),
      fromId: message.fromId,
      toId: message.toId
    }));
  }

}
