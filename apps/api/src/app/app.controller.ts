import { Controller, Get } from '@nestjs/common';
import { FMGoodsService, FmOrdersService } from '@project-lc/firstmall-db';

@Controller()
export class AppController {
  constructor(
    private readonly firstmallGoods: FMGoodsService,
    private readonly fmOrders: FmOrdersService,
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
