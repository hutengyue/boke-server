import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Message} from "../entities/message.entity";
import convert from "../utils/convert";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async findAll() {
        let messages = await this.messageRepository.find({
            relations: ['user'],
            order: {
                createAt: 'DESC'
            }
        })
        let result = messages.map(({user, ...message})=>({
            ...message,
            headImg:user.headImg,
            username:user.username
        }))
        return result
    }

    async findByPage(page: number, limit: number) {
        const [messages, total] = await this.messageRepository.findAndCount({
            relations: ['user'],
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createAt: 'DESC'
            }
        });

        const formattedMessages = messages.map(({user, ...message}) => ({
            ...message,
            headImg: user.headImg,
            username: user.username
        }));

        return {
            items: formattedMessages,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async sendMessage(userId: number, content: string) {
        const message = this.messageRepository.create({
            userId,
            content
        });
        await this.messageRepository.save(message);
        // 获取包含用户信息的完整消息
        const messageWithUser = await this.messageRepository.findOne({
            where: { messageId: message.messageId },
            relations: ['user']
        });

        // 格式化返回数据
        const { user, ...messageInfo } = messageWithUser;
        return {
            ...messageInfo,
            headImg: user.headImg,
            username: user.username
        };
    }
}
