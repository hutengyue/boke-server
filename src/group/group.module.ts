import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from 'src/entities/group.entity';
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]

})
export class GroupModule {}
