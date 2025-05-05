import { Module } from '@nestjs/common';
import { GmessageService } from './gmessage.service';
import { GmessageController } from './gmessage.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Gmessage} from "../entities/gmessage.entity";
import {User} from "../entities/user.entity";
import { Group } from 'src/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gmessage,User,Group])],
  controllers: [GmessageController],
  providers: [GmessageService],
  exports: [GmessageService]
})
export class GmessageModule {}
