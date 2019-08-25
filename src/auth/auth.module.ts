import { DynamicModule, Module } from '@nestjs/common';
import { AuthService, AUTH_MODEL } from './auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  static forRootAsync(options): DynamicModule {
    return {
      imports: options.imports,
      module: AuthModule,
      providers: [{
        provide: AUTH_MODEL,
        useFactory: options.useFactory,
        inject: options.inject,
      }],
      exports: [AuthService],
    };
  }
}
