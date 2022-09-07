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

  @Get()
  findPromotionPage(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
  ): Promise<BroadcasterPromotionPage> {
    return this.broadcasterPromotionPageService.findByBroadcasterId(broadcasterId);
  }

  @Get('goods')
  findPromotionPageGoods(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
    @Query(new ValidationPipe({ transform: true })) dto: FindManyDto,
  ): Promise<PromotionPagePromotionGoodsRes> {
    return this.broadcasterPromotionPageService.findPromotionGoods(broadcasterId, dto);
  }

  @Get('ranking')
  async findRanking(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
    @Query(new ValidationPipe({ transform: true })) dto: GetRankingDto,
  ): Promise<GetRankingRes> {
    return this.broadcasterPromotionPageService.getRanking(broadcasterId, dto);
  }
}
