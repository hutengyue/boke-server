import { Injectable,BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { MailerService } from "@nestjs-modules/mailer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import config from "../config";
import * as svgCaptcha from 'svg-captcha'
import convert from "../utils/convert";

@Injectable()
export class AuthService {
  private codeStore:Map<string, string> = new Map();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  getCaptcha(){
    let options = {
      size: 4, // 4个字母
      noise: 3, // 干扰线2条
      color: true, // 文字颜色
      background: "#fff", // 背景颜色
    }
    let captcha = svgCaptcha.create(options)
    return {captcha:captcha.data,text:captcha.text}
  }

  async login(user: Partial<User>) {
    const payload = { username: user.username, userId: user.userId };
    const token = this.jwtService.sign(payload);
    let result = {
      ...user,
      token:'Bearer ' + token
    }
    return result
  }

  async sendMail(email:string){
    if(await this.userRepository.findOneBy({ email })){
      return ({msg:'该邮箱已被注册',type:'warning'});
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
    return ({msg:'请注意接收邮件',type:'success'});
  }

  async register(body: any) {
    let user = body.user
    if (body.regCode == this.codeStore.get(user.email)) {
      if (await this.userRepository.count({where: {username: user.username}}) > 0) {
        return ({msg:'已存在的用户名',type:'error'});
      }
      this.codeStore.delete(user.email)
      let result = Object.assign(new User(), user)
      result = await this.userRepository.save(result);
      await this.userRepository.createQueryBuilder().relation(User,"groups")
      .of(result).add(1)
      await this.userRepository.createQueryBuilder().relation(User, "friends")
      .of(result).add(1);
      return ({msg:'注册成功',type:'success'});
    } else {
      return ({msg:'验证码错误',type:'error'});
    }
  }
}