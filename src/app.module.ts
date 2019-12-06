import { MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { Auth2Module } from './app/auth/auth.module';
import { Model } from './app/auth/model';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.redis(),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.mysql(),
      inject: [ConfigService],
    }),
    AuthModule.forRootAsync({
      imports: [Auth2Module],
      useFactory: (model: Model) => model,
      inject: [Model],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly authService: AuthService) {}

  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    // return consumer.apply(this.authService.authenticate()).forRoutes('authenticate');
  }

}
