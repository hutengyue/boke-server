import { Controller, Get, Param } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('user/:userId')
  async getUserGroups(@Param('userId') userId: string) {
    return await this.groupService.findUserGroups(+userId);
  }
}
