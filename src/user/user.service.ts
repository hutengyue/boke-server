import { Injectable } from '@nestjs/common';
import {User} from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(userId: number) {
    return this.userRepository.findOneBy({ userId });
  }

  findByName(username:string){
    return this.userRepository.findOneBy({username})
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({email})
  }

}
