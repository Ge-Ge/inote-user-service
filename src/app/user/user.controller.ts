import { Controller, Get, Post, UseGuards, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { OAuth } from '../../auth/auth.guard';
import { AuthService } from '../../auth/auth.service';
import { User } from './user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly auth: AuthService) {
  }

  @ApiResponse({ status: 201, description: '注册'})
  @Post('register')
  async register(@Body() user: User) {
    // TODO 参数校验、用户校验
    await this.userService.register(user);
    return true;
  }

  @ApiResponse({ status: 201, description: '登录'})
  @Post('login')
  async login(@Req() request: Request) {
    const token = await this.auth.token(request, {});
    request.cookies.set('accessToken', token.accessToken, { signed: true, expires: new Date(token.accessTokenExpiresAt) });
    request.cookies.set('refreshToken', token.refreshToken, { signed: true, expires: new Date(token.refreshTokenExpiresAt) });
    return token.user;
  }

  @ApiResponse({ status: 201, description: '登出'})
  @UseGuards(OAuth('authenticate'))
  @Post('logout')
  async logout(@Body() user: User) {
    // TODO 清楚redis 登录信息
    return true;
  }

}
