import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { StrategyOptions } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import config from "../config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secretOrKey,
    } as StrategyOptions);
  }

  async validate(payload: User) {
    const existUser = await this.userRepository.findOne({
      where: { userId: payload.userId },
    });
    if (!existUser) {
      throw new UnauthorizedException({msg:"身份验证失败"});
    }
    return existUser;
  }
}
