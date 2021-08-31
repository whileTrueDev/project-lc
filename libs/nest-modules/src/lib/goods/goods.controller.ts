import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteGoodsDto, GoodsListDto } from '@project-lc/shared-types';
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
      // email: 'a1919361@gmail.com',
      email: seller.sub, // seller.email
      page: goodsListDto.page,
      itemPerPage: goodsListDto.itemPerPage,
      sort: goodsListDto.sort,
      direction: goodsListDto.direction,
    });
  }

  @Get('/stock')
  getStockInfo(@Query('id', ParseIntPipe) id: number) {
    return this.goodsService.getStockInfo(id);
  }

  @Patch('/expose')
  changeGoodsView(@Body() dto: { view: 'look' | 'notLook'; id: number }) {
    const { id, view } = dto;
    return this.goodsService.changeGoodsView(id, view);
  }

  @Delete()
  async deleteGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: DeleteGoodsDto,
  ) {
    const email = seller.sub;
    // const email = 'a1919361@gmail.com';
    return this.goodsService.deleteLcGoods({
      email,
      ids: dto.ids,
    });
  }
}
