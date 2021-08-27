import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@project-lc/nest-modules';
import { GoodsService } from './goods.service';

// @UseGuards(JwtAuthGuard)
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('/list')
  getGoodsList() {
    return this.goodsService.getGoodsList({
      // sellerId: 1,
      email: 'a1919361@gmail.com',
      page: 1,
      itemPerPage: 10,
    });
  }
}
