import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req,Query,DefaultValuePipe,ParseIntPipe} from "@nestjs/common";
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

  @Get('list')
  async getUsersByPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.userService.getUsersByPage(page, limit);
  }

  // @UseGuards(JwtGuard)
  @Get('123')
  findAll() {
    return this.userService.findAll();
  }

  @Post('searchByUsername')
  findByName(@Body() body:any) {
    return this.userService.findByName(body.username);
  }

  @Post('update')
  update(@Body() body:any) {
    return this.userService.update(body.user);
  }

  @Post('searchByUserId')
  findByUserId(@Body() body:any) {
    return this.userService.findByUserId(body.userId);
  }
}
