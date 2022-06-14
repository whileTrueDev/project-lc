import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  BroadcasterSettlementReceivableAmountRes,
  BroadcasterSettlementTargetRes,
  FmSettlementTarget,
} from '@project-lc/shared-types';
import { calcBroadcasterSettlementTotalInfo } from '@project-lc/utils';
import dayjs from 'dayjs';
import { FmSettlementService } from './fm-settlements.service';

@UseGuards(JwtAuthGuard)
@Controller('fm-settlements')
export class FmSettlementController {
  constructor(private readonly fmSettleService: FmSettlementService) {}

  /** @deprecated 정산 대상 조회 - 모든 판매자 */
  @UseGuards(AdminGuard)
  @Get('targets')
  @UseInterceptors(HttpCacheInterceptor)
  getAllSettlementTargets(): Promise<FmSettlementTarget[]> {
    return this.fmSettleService.findAllSettleTargetList();
  }

  /** @deprecated 정산 대상 조회 - 모든 방송인 */
  @UseGuards(AdminGuard)
  @Get('broadcaster/targets')
  @UseInterceptors(HttpCacheInterceptor)
  getBroadcasterSettlementTargets(): Promise<BroadcasterSettlementTargetRes> {
    return this.fmSettleService.findBcSettleTargetList();
  }

  /** @deprecated 정산 대상 조회 - 특정 방송인 */
  @Get('broadcaster/:broadcasterId/targets')
  async getOneBcSettlementTargets(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterSettlementTargetRes> {
    if (!broadcasterId) return [];
    return this.fmSettleService.findBcSettleTargetList(broadcasterId);
  }

  /** @deprecated 정산 예정 금액 조회 - 특정 방송인 */
  @Get('broadcaster/:broadcasterId/receivable-amount')
  async getAmount(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterSettlementReceivableAmountRes> {
    const targets = await this.fmSettleService.findBcSettleTargetList(broadcasterId);
    const result = targets.reduce(
      (prev, target) => {
        const calculated = calcBroadcasterSettlementTotalInfo(target.items);

        const date = dayjs(target.confirm_date);
        let { startedAt, endedAt } = prev;
        if (date.isAfter(prev.endedAt)) endedAt = date;
        if (date.isBefore(prev.startedAt)) startedAt = date;

        return {
          amount: prev.amount + calculated.settleAmount,
          startedAt: !prev.startedAt ? date : startedAt,
          endedAt: !prev.endedAt ? date : endedAt,
        };
      },
      { amount: 0, startedAt: null, endedAt: null },
    );

    return result;
  }
}
