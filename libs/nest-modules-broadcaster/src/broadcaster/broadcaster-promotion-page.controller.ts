import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Broadcaster, BroadcasterPromotionPage } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  FindManyDto,
  GetRankingDto,
  type GetRankingRes,
  type PromotionPagePromotionGoodsRes,
} from '@project-lc/shared-types';
import { BroadcasterPromotionPageService } from './broadcaster-promotion-page.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('broadcaster/:broadcasterId/promotion-page')
export class BroadcasterPromotionPageContoller {
  constructor(
    private readonly broadcasterPromotionPageService: BroadcasterPromotionPageService,
  ) {}

  /** 방송인 홍보페이지 조회 */
  @Get()
  findPromotionPage(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
  ): Promise<BroadcasterPromotionPage> {
    return this.broadcasterPromotionPageService.findByBroadcasterId(broadcasterId);
  }

  /** 방송인 홍보페이지에 등록된 상품 목록 조회 */
  @Get('goods')
  findPromotionPageGoods(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
    @Query(new ValidationPipe({ transform: true })) dto: FindManyDto,
  ): Promise<PromotionPagePromotionGoodsRes> {
    return this.broadcasterPromotionPageService.findPromotionGoods(broadcasterId, dto);
  }

  /** 방송인 홍보페이지에 표시할 랭킹 정보 조회 */
  @Get('ranking')
  async findRanking(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
    @Query(new ValidationPipe({ transform: true })) dto: GetRankingDto,
  ): Promise<GetRankingRes> {
    return this.broadcasterPromotionPageService.getRanking(broadcasterId, dto);
  }
}
