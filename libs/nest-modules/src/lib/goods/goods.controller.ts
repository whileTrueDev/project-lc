import { Body, Controller, Delete, Get, Query, ValidationPipe } from '@nestjs/common';
import { GoodsListDto } from '@project-lc/shared-types';
import { GoodsService } from './goods.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { UserPayload } from '../auth/auth.interface';

// @UseGuards(JwtAuthGuard)
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('/list')
  getGoodsList(
    @SellerInfo() seller: UserPayload,
    @Query(new ValidationPipe({ transform: true })) goodsListDto: GoodsListDto,
  ) {
    return this.goodsService.getGoodsList({
      email: seller.sub, // seller.email
      page: goodsListDto.page,
      itemPerPage: goodsListDto.itemPerPage,
      sort: goodsListDto.sort,
      direction: goodsListDto.direction,
    });
  }

  @Delete()
  deleteGoods(@SellerInfo() seller: UserPayload, @Body() body: any) {
    return seller;
    // return this.goodsService.deleteGoods();
  }
}
