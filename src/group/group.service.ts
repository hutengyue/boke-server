import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Gmessage} from "../entities/gmessage.entity";
import convert from "../utils/convert";
import convertTime from "../utils/convertTime";
import {UserService} from '../user/user.service'
import {User} from "../entities/user.entity";

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Gmessage)
        private readonly groupRepository: Repository<Gmessage>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async find(pageNo:number,pageSize:number) {
        const skip = (pageNo - 1) * pageSize;
        let groups = await this.groupRepository.find({
            relations: ['user'],
            skip,
            take: pageSize
        })
        let result = groups.map(group=>({
            ...group,
            createAt:convertTime(group.createAt)
        }))
        return result
    }

    async send(userId, message) {
        const gmessage = new Gmessage()
        gmessage.message = message
        let user = await this.userRepository.findOneBy({userId})
        gmessage.user = user
        let newGroup = await this.groupRepository.save(gmessage)
        let result = {
            ...newGroup,
            createAt:convertTime(newGroup.createAt)
        }
        return result
    }
}
