import { Controller, Get, Post, UseGuards, Body, Req, Res, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { OAuth } from '../../auth/auth.guard';
import { AuthService } from '../../auth/auth.service';
import { User } from './user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RedisService } from '../../redis/redis.service';
import { key } from '../redis/redisKey';
import { LOGIN_ACCESS_TOKEN, LOGIN_REFRESH_TOKEN } from '../redis/constants';
@Controller('user')
export class UserController {
  redis: any;
  constructor(private readonly userService: UserService,
              private readonly auth: AuthService,
              private readonly redisService: RedisService,
              ) {
    this.redis = redisService.getClient();
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
    return token;
  }

  @ApiResponse({ status: 201, description: '登出'})
  @UseGuards(OAuth('authenticate'))
  @Put('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    request.cookies.set('accessToken', '', { signed: true, expires: new Date(0) });
    request.cookies.set('refreshToken', '', { signed: true, expires: new Date(0) });
    const token = response.locals.token;
    const refreshToken = key(LOGIN_REFRESH_TOKEN.key, token.refreshToken);
    const accessToken = key(LOGIN_ACCESS_TOKEN.key, token.accessToken);
    this.redis.del(refreshToken);
    this.redis.del(accessToken);
    return response.send();
  }

}
