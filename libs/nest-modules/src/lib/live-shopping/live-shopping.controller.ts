import { Controller, Get, Param } from '@nestjs/common';
import { ApprovedGoodsNameAndIds } from '@project-lc/shared-types';
import { GoodsService } from '../goods/goods.service';

@Controller('live')
export class LiveShoppingController {
  constructor(private readonly goodsService: GoodsService) {}
  @Get()
  async getApprovedGoodsList(@Param() email: string): Promise<ApprovedGoodsNameAndIds[]> {
    const goodsList = await this.goodsService.findMyGoodsNames(email);
    return goodsList;
  }
}
