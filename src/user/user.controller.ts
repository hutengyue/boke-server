import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from "@nestjs/common";
import { UserService } from './user.service';
import { User } from "../entities/user.entity";
import { JwtGuard } from "../guard/jwt.guard";
import type {Request} from "express";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  findOne(@Req() req:Request) {
    return this.userService.findOne(req.user);
  }

  // @UseGuards(JwtGuard)
  @Get('123')
  findAll() {
    return this.userService.findAll();
  }

  @Post('search')
  findByName(@Body() body:any) {
    return this.userService.findByName(body.username);
  }
}
