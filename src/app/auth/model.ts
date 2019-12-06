import { UserService } from '../user/user.service';
import { RedisService } from '../../redis/redis.service';
import { LOGIN_ACCESS_TOKEN, LOGIN_REFRESH_TOKEN } from '../redis/constants';
import { key } from '../redis/redisKey';
import { Injectable, UnauthorizedException } from '@nestjs/common';

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
    const existsUser = await this.userService.loginByEmail(username, password);
    return existsUser;
  }

  async saveToken(token, client, user) {
    const NewToken = Object.assign({}, token, { user }, { client });
    await this.redis.hmset(key(LOGIN_ACCESS_TOKEN.key, token.accessToken), Object.assign({
      user: JSON.stringify(user),
      client: JSON.stringify(client),
    }, token));
    this.redis.expire(key(LOGIN_ACCESS_TOKEN.key, token.accessToken), LOGIN_ACCESS_TOKEN.express);
    this.redis.set(key(LOGIN_REFRESH_TOKEN.key, token.refreshToken), token.accessToken);
    this.redis.expire(key(LOGIN_REFRESH_TOKEN.key, token.refreshToken),  LOGIN_REFRESH_TOKEN.express);
    return NewToken;
  }

  async getAccessToken(bearerToken) {
    const token = await this.redis.hgetall(key(LOGIN_ACCESS_TOKEN.key, bearerToken));
    if (!token || !token.accessTokenExpiresAt) { return null; }
    token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
    token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
    token.user = JSON.parse(token.user);
    token.client = JSON.parse(token.client);
    return token;
  }

  async getRefreshToken(refreshToken) {
    // TODO 只要refreshToken没有过期，都可以获得新token
    let token = await this.redis.get(key(LOGIN_REFRESH_TOKEN.key, refreshToken));
    // console.log(token);
    token = await this.redis.hgetall(key(LOGIN_ACCESS_TOKEN.key, token));
    if (!token || !token.accessTokenExpiresAt) { throw new UnauthorizedException('请登录, getRefreshToken Error'); }
    token.refreshToken = refreshToken;
    token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
    token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
    token.user = JSON.parse(token.user);
    token.client = JSON.parse(token.client);
    return token;
  }

  revokeToken(token) {
    this.redis.del(key(LOGIN_REFRESH_TOKEN, token.refreshToken));
    return this.redis.del(key(LOGIN_ACCESS_TOKEN, token.accessToken)).then(num => {
      return !!num;
    }).catch(err => {
      console.log(err, '删除token出错');
      return false;
    });
  }
}
