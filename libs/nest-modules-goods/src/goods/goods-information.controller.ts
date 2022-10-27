import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Goods, GoodsInformationNotice } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsInformationNoticeDto } from '@project-lc/shared-types';
import { GoodsInformationService } from './goods-information.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('goods/:goodsId/information-notice')
export class GoodsInformationController {
  constructor(private readonly goodsInformationService: GoodsInformationService) {}

  /** 상품에 연결된 상품제공고시 내용 수정 */
  @Put()
  updateGoodsInformationNotice(
    @Param('goodsId', ParseIntPipe) goodsId: Goods['id'],
    @Body(ValidationPipe) dto: GoodsInformationNoticeDto,
  ): Promise<GoodsInformationNotice> {
    return this.goodsInformationService.updateGoodsInformationNotice(goodsId, dto);
  }
}
