import { Injectable } from '@nestjs/common';
import {User} from "../entities/User";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(user:User) {
    return this.userRepository.insert(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(userId: number) {
    return this.userRepository.findOneBy({ userId });
  }

  findByName(username:string){
    return this.userRepository.findOneBy({username})
  }

  async login(loginDto: LoginDto) {
    let {email,password} = loginDto
    let result = await this.userRepository.find({
      where: {
        email,password
      }
    })
    return result
  }
}
