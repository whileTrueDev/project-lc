import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Broadcaster } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { BroadcasterSettlementTargets, FindManyDto } from '@project-lc/shared-types';
import { BroadcasterSettlementService } from './broadcaster-settlement.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('broadcaster/:broadcasterId/settlement')
export class BroadcasterSettlementController {
  constructor(private readonly settlementService: BroadcasterSettlementService) {}

  /** 정산 예정 금액 조회 - 특정 방송인 */
  @Get('receivable-amount')
  public async getReceivableAmount(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
  ): Promise<number> {
    return this.settlementService.getReceivableAmount(broadcasterId);
  }

  /** 정산 예정 목록 조회 - 특정 방송인 */
  @Get('targets')
  public async findSettlementTargets(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
    @Query(new ValidationPipe({ transform: true })) dto: FindManyDto,
  ): Promise<BroadcasterSettlementTargets> {
    return this.settlementService.findSettlementTargets(broadcasterId, dto);
  }
}
