import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { MailerService } from "@nestjs-modules/mailer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import config from "../config";

@Injectable()
export class AuthService {
  private codeStore:Map<string, string> = new Map();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async login(user: Partial<User>) {
    const payload = { username: user.username, userId: user.userId };
    const token = this.jwtService.sign(payload);
    return {
      token:'Bearer ' + token
    };
  }

  async sendMail(email:string){
    if(await this.userRepository.findOneBy({ email })){
      return {msg:'该邮箱已被注册',type:'warnning'}
    }
    let code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0')
    const mail = {
      from: config.mail.from,
      subject: '验证码',
      to: email,
      html: `
        <p>您好！</p>
        <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
        <p>如果不是您本人操作，请无视此邮件</p>
      `
    }
    this.codeStore.set(email,code)
    await this.mailService.sendMail(mail)
  }

  register(body:any){
    let user = body.user
    if(body.code == this.codeStore.get(user.email)){
      this.codeStore.delete(user.email)
      let result = Object.assign(new User(),user)
      this.userRepository.insert(result);
      return {msg:'注册成功',type:'success'}
    }else{
      return {msg:'验证码错误',type:'error'}
    }
  }
}