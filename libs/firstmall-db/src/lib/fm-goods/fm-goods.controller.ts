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
import { SellerInfo, UserPayload } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsService } from '@project-lc/nest-modules-goods';
import {
  ChangeGoodsViewDto,
  DeleteGoodsDto,
  GoodsOptionWithStockInfo,
} from '@project-lc/shared-types';
import { FMGoodsService } from './fm-goods.service';

@Controller('fm-goods')
export class FmGoodsController {
  constructor(
    private readonly fmGoodsService: FMGoodsService,
    private readonly projectLcGoodsService: GoodsService,
  ) {}

  @Get('/stock')
  getStockInfo(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<GoodsOptionWithStockInfo[]> {
    return this.fmGoodsService.getStockInfo(id);
  }

  /**
   * fm_goods 테이블의 상품 노출여부를 변경
   * @param dto
   * @returns
   */
  @Patch('/expose')
  changeGoodsView(@Body(ValidationPipe) dto: ChangeGoodsViewDto): Promise<boolean> {
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
  ): Promise<boolean> {
    const email = seller.sub;
    // const email = 'a1919361@gmail.com';

    const confirmedFmGoodsIds = await this.projectLcGoodsService.findMyGoodsIds(
      email,
      dto.ids,
    );

    return this.fmGoodsService.deleteFmGoods(confirmedFmGoodsIds);
  }
}
