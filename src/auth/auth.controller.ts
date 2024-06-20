import { Body, Controller, Injectable, Post, Req, UseGuards } from "@nestjs/common";
import {LocalAuthGuard} from '../guard/local-auth.guard'
import { AuthService} from "./auth.service";
import type {Request} from "express";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req:Request){
    return this.authService.login(req.user)
  }

  @Post('email')
  sendMail(@Body() email:string){
    return this.authService.sendMail(email)
  }

  @Post('register')
  register(@Body() body:any) {
    return this.authService.register(body);
  }
}