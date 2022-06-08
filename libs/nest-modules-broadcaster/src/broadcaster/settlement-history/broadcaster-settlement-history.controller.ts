import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  BroadcasterInfo,
  HttpCacheInterceptor,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { FindBcSettlementHistoriesRes } from '@project-lc/shared-types';
import { Broadcaster } from '.prisma/client';
import { BroadcasterSettlementHistoryService } from './broadcaster-settlement-history.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('broadcaster/settlement-history')
export class BroadcasterSettlementHistoryController {
  constructor(
    private readonly settlementHistoryService: BroadcasterSettlementHistoryService,
  ) {}

  /** 방송인 정산 내역 조회 */
  @Get(':broacasterId')
  public async findSettlementHistories(
    @BroadcasterInfo() bc: UserPayload,
    @Param('broacasterId', ParseIntPipe) broadcasterId: Broadcaster['id'],
  ): Promise<FindBcSettlementHistoriesRes> {
    if (bc.id !== broadcasterId)
      throw new UnauthorizedException('본인 계정의 정산 내역만 조회할 수 있습니다.');
    return this.settlementHistoryService.findHistoriesByBroadcaster(broadcasterId);
  }

  /** 방송인 누적 정산 금액 조회 */
  @Get('/accumulated-settlement-amount/:broadcasterId')
  public async findAccumulatedSettlementAmount(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<number> {
    const acc = await this.settlementHistoryService.findAccumulatedSettlementAmount(
      broadcasterId,
    );
    return acc._sum.amount;
  }
}
