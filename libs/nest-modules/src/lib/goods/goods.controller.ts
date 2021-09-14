import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ChangeGoodsViewDto,
  DeleteGoodsDto,
  RegistGoodsDto,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
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
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('itemPerPage', new DefaultValuePipe(10), ParseIntPipe) itemPerPage: number,
    @Query('sort', new DefaultValuePipe(SellerGoodsSortColumn.REGIST_DATE))
    sort: SellerGoodsSortColumn,
    @Query('direction', new DefaultValuePipe(SellerGoodsSortDirection.DESC))
    direction: SellerGoodsSortDirection,
  ) {
    return this.goodsService.getGoodsList({
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
  changeGoodsView(@Body(ValidationPipe) dto: ChangeGoodsViewDto) {
    const { id, view } = dto;
    return this.goodsService.changeGoodsView(id, view);
  }

  @Delete()
  async deleteGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: DeleteGoodsDto,
  ) {
    const email = seller.sub;
    return this.goodsService.deleteLcGoods({
      email,
      ids: dto.ids,
    });
  }

  @Post()
  registGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: RegistGoodsDto,
  ) {
    const email = seller.sub;
    return this.goodsService.registGoods(email, dto);
  }
}
