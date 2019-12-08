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
    return user;
  }

  getUsers() {
    return this.userRepository.find();
  }

  /**
   * 注册用户
   * @param user
   */
  register(user: User) {
    const { email } = user;
    const exist = this.userRepository.findOne({
      select: [ 'id', 'username', 'email', 'status' ],
      where: { email },
    });
    if (exist) {
      throw new ForbiddenException('用户已注册');
    }
    return this.userRepository.insert(user);
  }
}
