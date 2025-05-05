import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('add')
  addFriend(@Body() body:any) {
    return this.friendService.addFriend(body.userId,body.friendId);
  }

  @Get(':userId')
  getFriends(@Param('userId') userId: number){
    return this.friendService.getFriends(userId);
  }

  

}
