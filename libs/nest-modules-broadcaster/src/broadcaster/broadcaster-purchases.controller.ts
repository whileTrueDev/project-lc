import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Broadcaster } from '@prisma/client';
import {
  BroadcasterPurchasesRes,
  FindBroadcasterPurchaseDto,
} from '@project-lc/shared-types';
import { BroadcasterPurchasesService } from './broadcaster-purchases.service';

@Controller('broadcaster/:broadcasterId/purchases')
export class BroadcasterPurchasesController {
  constructor(private readonly service: BroadcasterPurchasesService) {}

  /** 판매 유형에 상관없이 구매 목록 조회 */
  @Get()
  public async findAll(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
    @Query(new ValidationPipe({ transform: true })) dto?: FindBroadcasterPurchaseDto,
  ): Promise<BroadcasterPurchasesRes> {
    if (!dto || !dto.by) return this.service.findAll(broadcasterId);
    if (dto.by === 'liveShopping') {
      return this.service.findByLiveShopping(broadcasterId, dto.liveShoppinId);
    }
    if (dto.by === 'productPromotion') {
      return this.service.findByProductPromotion(broadcasterId, dto.productPromotionId);
    }
    return [];
  }
}
