import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/User";
import { Repository } from "typeorm";

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addFriend(userId: number, friendId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['friends']
    });
    const friend = await this.userRepository.findOne({
      where: { userId: friendId }
    });

    if (user && friend) {
      user.friends.push(friend);
      await this.userRepository.save(user);
    }
    return {type:'success',msg:'添加成功'}
  }

  async getFriends(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
      relations: ['friends']
    });
    return user ? user.friends : [];
  }
}
