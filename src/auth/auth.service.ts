import { Injectable, ExecutionContext, Inject, HttpException } from '@nestjs/common';
import OAuth2Server =  require('oauth2-server');
const { Request, Response, OAuthError } = OAuth2Server;

export const AUTH_MODEL = Symbol('AUTH_MODEL');

@Injectable()
export class AuthService {

  server: OAuth2Server;
  constructor(@Inject(AUTH_MODEL) model: any) {
    // console.log(model);
    this.server = new OAuth2Server({ model });
  }
  // 验证token, 使用guard
  authenticate(req, res, options?) {
       const request = new Request(req);
       const response = new Response(res);
       return this.server.authenticate(request, response, options);
  }

  // 根据账号密码等，授予授权码
  authorize(req, res, options?) {
    const request = new Request(req);
    const response = new Response(res);
    return this.server.authorize(request, response, options);
  }

  // 根据授权码/账号密码，授予token
  async token(req, res, options?) {
    try {
      const request = new Request(req);
      const response = new Response(res);
      const token = await this.server.token(request, response, options);
      return token;
    } catch (e) {
      if (e instanceof OAuthError) {
        throw new HttpException({ code: e.code, message: e.message }, e.code);
      }
      throw e;
    }

  }
}
