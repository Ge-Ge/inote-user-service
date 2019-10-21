import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { OAuth } from '../../auth/auth.guard';
import { User } from './user.entity';
import { ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @ApiResponse({ status: 201, description: '注册'})
  @Post('register')
  async register(@Body() user: User) {
    await this.userService.create(user);
    return true;
  }

  @ApiResponse({ status: 201, description: '登录'})
  @Post('login')
  async login(@Body() user: User) {
    const userInfo = await this.userService.getUserByEmail(user.email);
    return userInfo;
  }

  @ApiResponse({ status: 201, description: '登出'})
  @Post('logout')
  async logout(@Body() user: User) {
    const userInfo = await this.userService.getUserByEmail(user.email);
    return userInfo;
  }

/*  @Post('login')
  @UseGuards(OAuth('authenticate'))
  async authenticate(@Body() user: User) {
    return true;
  }*/

}
