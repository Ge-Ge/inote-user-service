import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
// import { OAuth } from '../../auth/auth.guard';
import { User } from './user.entity';
import { OAuth } from '../../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('users')
  // @UseGuards(OAuth('token'))
  findAll() {
    return [];
  }

  @GrpcMethod('UserService', 'FindOne')
  async getUser(data: any, metadata: any) {
    const user = await this.userService.getUser(data.id);
    return user;
  }
  @GrpcMethod('UserService', 'FindAll')
  async getUsers(messages) {
    const users = await this.userService.getUsers();
    return { users };
  }
  @GrpcMethod('UserService')
  async create(data: any, metadata: any) {
    await this.userService.create(data);
    return data;
  }

  @GrpcMethod('UserService')
  async delete(data: any, metadata: any) {
    await this.userService.delete(data.id);
    return data.id;
  }

  @GrpcMethod('UserService')
  async update(data: any, metadata: any) {
    await this.userService.update(data);
    return data;
  }

  @Post('register')
  async register(@Body() user: User) {
    await this.userService.create(user);
    return true;
  }

  @Post('login')
  async login(@Body() user: User) {
    const userInfo = await this.userService.getUserByEmail(user.email);
    return userInfo;
  }

/*  @Post('login')
  @UseGuards(OAuth('authenticate'))
  async authenticate(@Body() user: User) {
    return true;
  }*/
}
