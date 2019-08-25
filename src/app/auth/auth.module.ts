import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { Model } from './model';

@Module({
  imports: [
    UserModule,
  ],
  providers: [Model],
  exports: [Model],
})
export class Auth2Module {}
