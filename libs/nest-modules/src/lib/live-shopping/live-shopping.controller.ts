import { Controller, Get } from '@nestjs/common';

import { GoodsService } from '@project-lc/nest-modules';

@Controller('live')
export class LiveShoppingController {
  constructor(private readonly goodsService: GoodsService) {}
  @Get()
  async getApprovedGoodsList(email): Promise<any[]> {
    const goodsList = await this.goodsService.findMyGoodsIds(email);
    return goodsList;
  }
}
