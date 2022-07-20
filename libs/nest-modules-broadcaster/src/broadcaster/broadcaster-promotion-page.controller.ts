import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Broadcaster, BroadcasterPromotionPage } from '@prisma/client';
import { FindManyDto, PromotionPagePromotionGoodsRes } from '@project-lc/shared-types';
import { BroadcasterPromotionPageService } from './broadcaster-promotion-page.service';

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
}
