import { Global, Module, DynamicModule, Type, ForwardReference } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { RedisService, REDIS_CLIENT } from './redis.service';
import { RedisOptions } from 'ioredis';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {

  static forRoot(options?: RedisOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [{
        provide: RedisService,
        useValue: new RedisService(options),
      }],
      exports: [RedisService],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      imports: options.imports,
      module: RedisModule,
      providers: [{
        provide: REDIS_CLIENT,
        useFactory: options.useFactory,
        inject: options.inject,
      }],
    };
  }
}

export interface RedisModuleAsyncOptions extends ModuleMetadata {
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  useFactory: (...args: any[]) => any;
  inject?: any[];
}
