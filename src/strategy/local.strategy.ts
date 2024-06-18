import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { IStrategyOptions } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email=:email', { email })
      .getOne();

    if (!user) throw new BadRequestException({msg:'用户不存在',type:'error'});
    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException({msg:'密码错误',type:'error'});

    return user;
  }
}