import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteGoodsDto } from '@project-lc/shared-types';
import { GoodsService } from '@project-lc/nest-modules';
import { FMGoodsService } from './fm-goods.service';

@Controller('fm-goods')
export class FmGoodsController {
  constructor(
    private readonly fmGoodsService: FMGoodsService,
    private readonly projectLcGoodsService: GoodsService,
  ) {}

  @Get('/:goodsSeq/stock')
  getStockInfo(@Param('goodsSeq', ParseIntPipe) goodsSeq: number) {
    return this.fmGoodsService.getStockInfo(goodsSeq);
  }

  @Delete()
  async deleteGoods(
    // @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: DeleteGoodsDto,
  ) {
    // const email = seller.sub;
    const email = 'a1919361@gmail.com';

    const confirmedFmGoodsIds = await this.projectLcGoodsService.findMyGoodsIds(
      email,
      dto.ids,
    );

    return this.fmGoodsService.deleteFmGoods(confirmedFmGoodsIds);
  }
}
