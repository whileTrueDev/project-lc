import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return 'alive';
  }

  @Get(':id')
  @Render('client')
  getRender() {
    return '';
  }
}
