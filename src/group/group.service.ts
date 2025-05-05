import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findUserGroups(userId: number) {
    return await this.groupRepository
      .createQueryBuilder('group')
      .innerJoin('group.members', 'user', 'user.userId = :userId', { userId })
      .leftJoinAndSelect('group.messages', 'messages')
      .orderBy('messages.createAt', 'DESC')
      .getMany();
  }
}
