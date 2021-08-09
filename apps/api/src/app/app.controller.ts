import { Controller, Get } from '@nestjs/common';
import { FMGoodsService } from '@project-lc/firstmall-db';

@Controller()
export class AppController {
  constructor(private readonly firstmallGoods: FMGoodsService) {}

  @Get()
  healthCheck() {
    return 'alive';
  }

  @Get('goods')
  getData() {
    return this.firstmallGoods.findAll();
  }
}
