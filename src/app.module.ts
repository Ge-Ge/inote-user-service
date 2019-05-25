import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EmailController } from './email/email.controller';
import { CaptchaController } from './captcha/captcha.controller';

@Module({
  imports: [UserModule],
  controllers: [AppController, EmailController, CaptchaController ],
  providers: [AppService ],
})
export class AppModule {}
