import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteGoodsDto, SortColumn, SortDirection } from '@project-lc/shared-types';
import { GoodsService } from './goods.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { UserPayload } from '../auth/auth.interface';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get('/list')
  getGoodsList(
    @SellerInfo() seller: UserPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('itemPerPage', new DefaultValuePipe(10), ParseIntPipe) itemPerPage: number,
    @Query('sort', new DefaultValuePipe(SortColumn.REGIST_DATE)) sort: SortColumn,
    @Query('direction', new DefaultValuePipe(SortDirection.DESC))
    direction: SortDirection,
  ) {
    return this.goodsService.getGoodsList({
      // email: 'a1919361@gmail.com',
      email: seller.sub, // seller.email
      page,
      itemPerPage,
      sort,
      direction,
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
