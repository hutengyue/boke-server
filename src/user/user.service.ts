import { Injectable } from '@nestjs/common';
import {User} from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import convert from "../utils/convert";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
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

  findByName(username:string){
    return this.userRepository.findOneBy({username})
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({email})
  }

}
