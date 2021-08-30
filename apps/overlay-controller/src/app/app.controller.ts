import { Controller, Get, Render } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('test')
  @Render('index')
  renterTest() {
    return { injectVariablesLikeThis: 'injected variables' };
  }
}
