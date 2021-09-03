import { Controller, Get, Render } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // * 화면 렌더링 예시 by Dan -> 예시 확인 이후 삭제해도 됩니다.
  @Get()
  @Render('index')
  async getData() {
    const data = 'Hello World';
    return data;
  }

  @Get(':id')
  @Render('client')
  async getRender() {
    // * prisma 데이터베이스 접근 호출 예시 by Dan
    const data = 'Hello World';
    return { message: data };
  }
}
