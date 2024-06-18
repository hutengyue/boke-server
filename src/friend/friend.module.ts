import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
