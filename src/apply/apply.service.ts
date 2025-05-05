import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apply } from '../entities/apply.entity';
import { User } from '../entities/user.entity';
import convertTime from 'src/utils/convertTime';
import { FriendService } from '../friend/friend.service';

@Injectable()
export class ApplyService {

  constructor(
    @InjectRepository(Apply)
    private readonly applyRepository: Repository<Apply>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly friendService: FriendService,
  ) {}

  async createApply(fromId: number, toId: number) {
    const user = await this.userRepository.findOne({
        where: { userId: fromId },
        relations: ['friends']
    });
    if (user && user.friends.some(friend => friend.userId === toId)) {
        return { msg: '你们已经是好友了', type: 'warning' };
    }

    const existingApply = await this.applyRepository.findOne({
        where: {
          fromId,
          toId,
          status: 'wait'
        }
    });
    if (existingApply) {
        return {msg:'您已经发送过申请了，请等待对方处理',type:'warning'}
    }

    const apply = this.applyRepository.create({
      fromId,
      toId,
      status: 'wait'
    });
    await this.applyRepository.save(apply);
    return {msg:'已经发送好友申请',type:'success'}
  }

  async getApplies(userId: number) {
    const applies = await this.applyRepository.find({
        where: {
            toId: userId
        },
        relations: ['from']
    });

    return applies.map(apply => ({
         ...apply,
         createAt:convertTime(apply.createAt)
    }));
  }


  async handleApply(applyId: number, status: 'yes' | 'no') {
    const apply = await this.applyRepository.findOne({
      where: { applyId }
    });

    if (!apply) {
      throw new NotFoundException({msg:'申请不存在',type:'error'});
    }

    apply.status = status;
    await this.applyRepository.save(apply);

    if (status === 'yes') {
      await this.friendService.addFriend(apply.fromId, apply.toId);
      return {type:'success',msg:'已同意好友申请'};
    }
    
    return {type:'warning',msg:'已拒绝好友申请'};
  }
}
