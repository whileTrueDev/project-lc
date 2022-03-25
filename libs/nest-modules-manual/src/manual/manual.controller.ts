import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';

// @UseInterceptors(HttpCacheInterceptor)
@Controller('manual')
export class ManualController {
  @Get()
  test(): string {
    return 'this is manual';
  }
}
