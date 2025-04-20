import { Injectable } from '@nestjs/common';
import {User} from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import convert from "../utils/convert";
import { log } from 'console';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    private uploadService: UploadService,
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
    // friend.headImg = convert(friend.headImg);
    return { message, type, user:friend };
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({email})
  }

  async update(user: Partial<User>) {
    const { password, ...updateData } = user;

    // 使用 update 方法只更新指定字段
    return this.userRepository.update(
      { userId: user.userId },
      updateData
    );
  }


  async getUsersByPage(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        userId: 'DESC'  // 按用户ID降序排序
      }
    });

    return {
      items: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
