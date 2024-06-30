import {Body, Controller, Get, Injectable, Post, Req, UseGuards} from "@nestjs/common";
import {LocalAuthGuard} from '../guard/local-auth.guard'
import { AuthService} from "./auth.service";
import type {Request} from "express";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:AuthService,
  ) {}

  @Get('captcha')
  getCaptcha(){
    return this.authService.getCaptcha()
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req:Request){
    return this.authService.login(req.user)
  }

  @Post('registerEmail')
  sendMail(@Body() body:any){
    return this.authService.sendMail(body.email)
  }

  @Post('register')
  register(@Body() body:any) {
    return this.authService.register(body);
  }
}