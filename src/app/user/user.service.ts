import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redis: RedisService,
  ) {}

  create(user: User) {
    return this.userRepository.insert(user);
  }

  delete(id) {
    return this.userRepository.delete({ id } )
      .then(() => id);
  }

  update(user: User) {
    return this.userRepository.update(user.id, user)
      .then(() => user);
  }

  getUser(id) {
    return this.userRepository.findOne({
      select: [ 'id', 'username', 'email', 'status' ],
      where: { id },
    });
  }

  getUserByEmail(email) {
    return this.userRepository.findOne({
      select: [ 'id', 'username', 'email', 'status' ],
      where: { email },
    });
  }

  async loginByEmail(email, password) {
    const user = await this.userRepository.findOne({
      select: [ 'id', 'username', 'email', 'status' ],
      where: { email, password },
    });
    if (!user) {
      throw new ForbiddenException('账号或密码错误');
    }
    // redis记录登录信息
    return user;
  }

  getUsers() {
    return this.userRepository.find();
  }
}
