import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Gmessage} from "../entities/gmessage.entity";
import convert from "../utils/convert";
import convertTime from "../utils/convertTime";
import {UserService} from '../user/user.service'
import {User} from "../entities/user.entity";
import { Group } from 'src/entities/group.entity';

@Injectable()
export class GmessageService {
    constructor(
        @InjectRepository(Gmessage)
        private readonly gmessageRepository: Repository<Gmessage>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
    ) {}

    // 获取用户所在群的最新消息和群信息
    async getUserGroupsLatestMessages(userId: number) {
        // 首先获取用户所在的所有群组ID
        const userGroups = await this.groupRepository
            .createQueryBuilder('group')
            .innerJoin('group.members', 'member')
            .where('member.userId = :userId', { userId })
            .getMany();
    
        if (!userGroups.length) {
            return [];
        }
    
        const groupIds = userGroups.map(group => group.groupId);
    
        // 使用子查询获取每个群的最新消息
        const result = await this.gmessageRepository
            .createQueryBuilder('gmessage')
            .innerJoinAndSelect('gmessage.group', 'group')
            .innerJoinAndSelect('gmessage.user', 'sender')
            .where('gmessage.groupId IN (:...groupIds)', { groupIds })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(m.gmessageId)')
                    .from(Gmessage, 'm')
                    .where('m.groupId = gmessage.groupId')
                    .getQuery();
                return 'gmessage.gmessageId = ' + subQuery;
            })
            .orderBy('gmessage.createAt', 'DESC')
            .getMany();
    
        // 处理时间格式
        return result.map(message => ({
            ...message,
            createAt: convertTime(message.createAt)
        }));
    }

    async find(pageNo: number, pageSize: number, groupId: number) {
        const skip = (pageNo - 1) * pageSize;
        
        // 构建查询
        const [messages, total] = await this.gmessageRepository.createQueryBuilder('gmessage')
            .leftJoinAndSelect('gmessage.user', 'user')
            .leftJoinAndSelect('gmessage.group', 'group')
            .where('gmessage.groupId = :groupId', { groupId })
            .orderBy('gmessage.createAt', 'DESC')
            .skip(skip)
            .take(pageSize)
            .getManyAndCount();
        
        // 处理返回结果
        const items = messages.map(message => ({
            ...message,
            createAt: convertTime(message.createAt)
        }));

        return {
            items,
            meta: {
                total,
                pageNo,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    }

    async send(userId, message,groupId) {
        const gmessage = new Gmessage()
        gmessage.message = message
        let user = await this.userRepository.findOneBy({userId})
        let group = await this.groupRepository.findOneBy({groupId})
        gmessage.group = group
        gmessage.user = user
        let newGroupMessage = await this.gmessageRepository.save(gmessage)
        let result = {
            ...newGroupMessage,
            createAt:convertTime(newGroupMessage.createAt)
        }
        return result
    }
}
