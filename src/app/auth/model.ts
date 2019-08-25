import { UserService } from '../user/user.service';
import { RedisService } from '../../redis/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Model {
  redis: any;
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService) {
    this.redis = redisService.getClient();
  }

  async getClient(clientId, clientSecret) {
    const client = { clientId: 1, clientSecret: 1, grants: ['password', 'refresh_token'] };
    if (client.clientId !== Number(clientId) || client.clientSecret !== Number(clientSecret)) {
      return;
    }
    return client;
  }

  async getUser(username, password) {
    const existsUser = await this.userService.getUserByEmail(username);
    if (existsUser) {
      return { id: existsUser.id };
    }
    throw { message: '用户不存在' };
  }

  async saveToken(token, client, user) {
    const NewToken = Object.assign({}, token, { user }, { client });
    await this.redis.hmset(token.accessToken, Object.assign({
      user: JSON.stringify(user),
      client: JSON.stringify(client),
    }, token));
    this.redis.expire(token.accessToken, 3600);
    this.redis.set(`t:token:${token.refreshToken}`, token.accessToken);
    this.redis.expire(`t:token:${token.refreshToken}`, 3600 * 24 * 15);
    return NewToken;
  }

  async getAccessToken(bearerToken) {
    const token = await this.redis.hgetall(bearerToken);
    if (!token || !token.accessTokenExpiresAt) { throw { message: '请登录, getAccessToken Error' }; }
    token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
    token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
    token.user = JSON.parse(token.user);
    token.client = JSON.parse(token.client);
    return token;
  }

  async getRefreshToken(refreshToken) {
    // TODO 只要refreshToken没有过期，都可以获得新token
    let token = await this.redis.get(`t:token:${refreshToken}`);
    // console.log(token);
    token = await this.redis.hgetall(token);
    if (!token || !token.accessTokenExpiresAt) { throw { message: '请登录, getAccessToken Error' };}
    token.refreshToken = refreshToken;
    token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
    token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
    token.user = JSON.parse(token.user);
    token.client = JSON.parse(token.client);
    return token;
  }

  revokeToken(token) {
    this.redis.del(`t:token:${token.refreshToken}`);
    return this.redis.del(token.accessToken).then(num => {
      return !!num;
    }).catch(err => {
      console.log(err, '删除token出错');
      return false;
    });
  }
}
