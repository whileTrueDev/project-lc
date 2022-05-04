import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';

@UseInterceptors(HttpCacheInterceptor)
@Controller('exchange')
export class ExchangeController {
  @Get()
  test(): any {
    return 'test exchange';
  }
}
