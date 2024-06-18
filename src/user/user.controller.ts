import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from "../entities/User";
import { LoginDto } from "../dto/login.dto"

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  findOne(@Param('userId') userId: number) {
    return this.userService.findOne(+userId);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() user:User) {
    return this.userService.create(user);
  }

  @Post('login')
  login(@Body() loginDto:LoginDto){
    return this.userService.login(loginDto)
  }

  @Post('search')
  findByName(@Body() body:any) {
    return this.userService.findByName(body.username);
  }
}
