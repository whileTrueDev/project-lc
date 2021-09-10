import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get(':id')
  @Render('client')
  getRender() {
    return '';
  }
}
