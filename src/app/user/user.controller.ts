import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from './user.entity';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  async getUser() {
    const user = await this.userService.getUser();
    return user;
  }

  @GrpcMethod('UserService', 'FindOne')
  findOne(data: any, metadata: any): User {
    const items = [
      { id: 1, username: 'John', password: '', email: '', status: 0 },
      { id: 2, username: 'John', password: '', email: '', status: 0 },
    ];
    return items.find(({ id }) => id === data.id);
  }
}
