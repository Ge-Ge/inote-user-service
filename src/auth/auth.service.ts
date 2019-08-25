import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import OAuth2Server =  require('oauth2-server');
const { Request, Response } = OAuth2Server;

export const AUTH_MODEL = Symbol('AUTH_MODEL');

@Injectable()
export class AuthService {

  server: OAuth2Server;
  constructor(@Inject(AUTH_MODEL) model: any) {
    // console.log(model);
    this.server = new OAuth2Server({ model });
  }
  // 验证token
  authenticate(options) {
    return async (req, res) => {
      const request = new Request(req);
      const response = new Response(res);
      return this.server.authenticate(request, response, options);
    };
  }

  // 授予授权码
  authorize(options) {
    const request = new Request();
    const response = new Response();
    return this.server.authorize(request, response, options);
  }
  // 授予token
  token(options?) {
    return async (req, res, next) => {
      const request = new Request(req);
      const response = new Response(res);
      const token = await this.server.token(request, response, options);
      res.locals.token = token;
      next();
    };
  }
}
