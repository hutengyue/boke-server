import { Module } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApplyController } from './apply.controller';
import { Apply } from 'src/entities/apply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FriendService } from 'src/friend/friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Apply,User])],
  controllers: [ApplyController],
  providers: [ApplyService,FriendService],
  exports:[ApplyService]
})
export class ApplyModule {}
