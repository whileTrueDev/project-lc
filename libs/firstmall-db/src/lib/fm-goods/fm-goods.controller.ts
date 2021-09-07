import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChangeGoodsViewDto, DeleteGoodsDto } from '@project-lc/shared-types';
import {
  GoodsService,
  JwtAuthGuard,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-modules';
import { FMGoodsService } from './fm-goods.service';

@Controller('fm-goods')
export class FmGoodsController {
  constructor(
    private readonly fmGoodsService: FMGoodsService,
    private readonly projectLcGoodsService: GoodsService,
  ) {}

  @Get('/stock')
  getStockInfo(@Query('id', ParseIntPipe) id: number) {
    return this.fmGoodsService.getStockInfo(id);
  }

  /**
   * fm_goods 테이블의 상품 노출여부를 변경
   * @param dto
   * @returns
   */
  @Patch('/expose')
  changeGoodsView(@Body(ValidationPipe) dto: ChangeGoodsViewDto) {
    const { id, view } = dto;
    return this.fmGoodsService.changeGoodsView(id, view);
  }

  /**
   * fm_goods테이블의 상품 데이터를 삭제
   * @param dto
   * @returns
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: DeleteGoodsDto,
  ) {
    const email = seller.sub;
    // const email = 'a1919361@gmail.com';

    const confirmedFmGoodsIds = await this.projectLcGoodsService.findMyGoodsIds(
      email,
      dto.ids,
    );

    return this.fmGoodsService.deleteFmGoods(confirmedFmGoodsIds);
  }
}
