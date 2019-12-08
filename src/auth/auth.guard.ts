import { CanActivate, ExecutionContext, Inject, Injectable, Optional, UnauthorizedException, mixin } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class OAuthCanActivate implements CanActivate {

  protected type: string;
  constructor(readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    try {
      const token = await this.authService.authenticate(request, response);
      if (!token) { return false; }
      response.locals.token = token;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
    return true;
  }

}

export function OAuth(type: string) {
  return mixin(class extends OAuthCanActivate {
    protected readonly type = type;
  });
}
