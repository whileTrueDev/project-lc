import { Controller, Delete, Get, Query, ValidationPipe } from '@nestjs/common';
import { GoodsListDto } from '@project-lc/shared-types';
import { GoodsService } from './goods.service';

// @UseGuards(JwtAuthGuard)
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('/list')
  getGoodsList(
    @Query(new ValidationPipe({ transform: true })) goodsListDto: GoodsListDto,
  ) {
    // return goodsListDto;
    return this.goodsService.getGoodsList({
      email: goodsListDto.email,
      page: goodsListDto.page,
      itemPerPage: goodsListDto.itemPerPage,
      sort: goodsListDto.sort,
      direction: goodsListDto.direction,
    });
  }

  @Delete()
  deleteGoods() {
    return this.goodsService.deleteGoods();
  }
}
