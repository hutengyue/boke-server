import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { JwtStrategy } from "../strategy/jwt.strategy";
import  { UploadModule } from "../upload/upload.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]),UploadModule],
  controllers: [UserController],
  providers: [UserService,JwtStrategy],
  exports: [UserService]
})
export class UserModule {}
