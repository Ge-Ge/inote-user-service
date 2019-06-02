import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/user/user.module';
import { EmailController } from './app/email/email.controller';
import { CaptchaController } from './app/captcha/captcha.controller';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [ConfigModule, UserModule, TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => configService.mysql(),
    inject: [ConfigService],
  })],
  controllers: [AppController, EmailController, CaptchaController],
  providers: [AppService],
})
export class AppModule {
}
