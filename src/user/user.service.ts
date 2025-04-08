import { Injectable } from '@nestjs/common';
import {User} from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import convert from "../utils/convert";
import { log } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }


  find(userId:number){
    return this.userRepository.findOneBy({userId})
  }

  async findOne(user: Partial<User>) {
    let target = await this.userRepository.findOneBy({userId: user.userId});
    let result = {
      ...target,
      headImg:convert(user.headImg),
      userId:user.userId.toString(),
      sex:user.sex.toString()
    }
    return result
  }

  async findByName(username: string) {
    const friend = await this.userRepository.findOneBy({ username });
    let message, type;
    if (friend) {
      message = '搜索成功';
      type = 'success';
    } else {
      message = '未找到对应的用户。';
      type = 'error';
    }
    friend.headImg = convert(friend.headImg);
    return { message, type, user:friend };
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({email})
  }

}
