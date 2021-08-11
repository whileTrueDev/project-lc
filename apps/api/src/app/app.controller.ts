import { Controller, Get } from '@nestjs/common';
import { FMGoodsService } from '@project-lc/firstmall-db';
import { MailService } from './mail/mail.service';

@Controller()
export class AppController {
  constructor(
    private readonly firstmallGoods: FMGoodsService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  healthCheck() {
    return 'alive';
  }

  @Get('goods')
  getData() {
    return this.firstmallGoods.findAll();
  }
}
