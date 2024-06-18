import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: Partial<User>) {
    const payload = { username: user.username, userId: user.userId };
    const token = this.jwtService.sign(payload);
    return {
      token,
      type: 'Bearer',
    };
  }
}