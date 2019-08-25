import { CanActivate, ExecutionContext, Inject, Injectable, Optional, UnauthorizedException, mixin } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class OAuthCanActivate implements CanActivate {

  protected type: string;
  constructor(readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const func = await this.authService[this.type]();
    try {
      const token = await func(request);
      if (!token) { return false; }
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
