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
        })
        let result = messages.map(message=>({
            ...message,
            // user:convert(message.user.headImg)
            user:message.user.headImg
        }))
        return result
    }
}
