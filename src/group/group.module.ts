import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Gmessage} from "../entities/gmessage.entity";
import {User} from "../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Gmessage,User])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule {}
