import { Controller, Get, Post, UseGuards, Response, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { OAuth } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('token')
  getHello(@Response() res): string {
    res.status(HttpStatus.CREATED).send()
    console.log(res.locals);
    return this.appService.getHello();
  }

  @Post('authenticate')
  @UseGuards(OAuth('authenticate'))
  authenticate(): string {
    return this.appService.getHello();
  }
}
