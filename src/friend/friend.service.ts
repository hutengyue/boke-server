import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
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
    const [user, otherUsers] = await Promise.all([
      this.userRepository.findOne({
        where: { userId: userId },
        relations: ['friends']
      }),
      this.userRepository.find({
        where: { friends: { userId: userId } },
        relations: ['friends']
      })
    ]);

    const directFriends = user ? user.friends : [];
    const reverseFriends = otherUsers || [];

    // 合并两个数组并去重
    const allFriends = [...directFriends, ...reverseFriends];
    const uniqueFriends = allFriends.filter((friend, index, self) =>
      index === self.findIndex((f) => f.userId === friend.userId)
    );
    return uniqueFriends;
  }
}
