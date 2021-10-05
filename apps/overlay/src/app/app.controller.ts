import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    return 'alive';
  }

  @Get(':id')
  @Render('client')
  getRender(): string {
    return '';
  }
}
