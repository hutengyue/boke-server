import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocalStrategy } from '../strategy/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { MailerModule} from "@nestjs-modules/mailer";
import {default as config} from '../config';

const jwtModule = JwtModule.register({
  secret:config.jwt.secretOrKey,
  signOptions:{ expiresIn:config.jwt.expiresIn }
})
const mailerModule = MailerModule.forRoot({
  transport:{
    service: config.mail.service,
    port:config.mail.port,
    secure:true,
    auth:{
      user:config.mail.user,
      pass:config.mail.pass
    }
  }
})

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    jwtModule,
    mailerModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy,AuthService],
  exports: [jwtModule]
})
export class AuthModule {}