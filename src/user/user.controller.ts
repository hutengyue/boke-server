import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { User } from "../entities/user.entity";
import { JwtGuard } from "../guard/jwt.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  findOne(@Param('userId') userId: number) {
    return this.userService.findOne(+userId);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() user:User) {
    return this.userService.create(user);
  }

  @Post('search')
  findByName(@Body() body:any) {
    return this.userService.findByName(body.username);
  }
}
