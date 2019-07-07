import { Inject, Injectable, Optional } from '@nestjs/common';
import * as Redis from 'ioredis';
import { RedisOptions } from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Injectable()
export class RedisService {

  options: RedisOptions;
  constructor(@Inject(REDIS_CLIENT) options: RedisOptions) {
    this.options = options;
  }

  getClient(option?: RedisOptions) {
    return new Redis(this.options || option);
  }
}
