import { Controller, Get, Header, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  BroadcasterSettlementReceivableAmountRes,
  BroadcasterSettlementTargetRes,
} from '@project-lc/shared-types';
import { calcBroadcasterSettlementTotalInfo } from '@project-lc/utils';
import dayjs from 'dayjs';
import { FmSettlementService } from './fm-settlements.service';

@Controller('fm-settlements')
export class FmSettlementController {
  constructor(private readonly fmSettleService: FmSettlementService) {}

  /** 정산 대상 조회 - 모든 판매자 */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('targets')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAllSettlementTargets(): Promise<any> {
    return this.fmSettleService.findAllSettleTargetList();
  }

  /** 정산 대상 조회 - 모든 방송인 */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('broadcaster/targets')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getBroadcasterSettlementTargets(): Promise<BroadcasterSettlementTargetRes> {
    return this.fmSettleService.findBcSettleTargetList();
  }

  /** 정산 대상 조회 - 특정 방송인 */
  @UseGuards(JwtAuthGuard)
  @Get('broadcaster/:broadcasterId/targets')
  async getOneBcSettlementTargets(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterSettlementTargetRes> {
    if (!broadcasterId) return [];
    return this.fmSettleService.findBcSettleTargetList(broadcasterId);
  }

  /** 정산 예정 금액 조회 - 특정 방송인 */
  @UseGuards(JwtAuthGuard)
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
