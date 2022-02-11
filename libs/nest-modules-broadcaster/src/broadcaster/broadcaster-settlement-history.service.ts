import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Broadcaster, SellType } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateManyBroadcasterSettlementHistoryDto,
  FindBcSettlementHistoriesRes,
} from '@project-lc/shared-types';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';

@Injectable()
export class BroadcasterSettlementHistoryService extends ServiceBaseWithCache {
  #BC_SETTLEMENT_HISTORY_CACHE_KEY = 'settlement-history';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 정산 내역 일괄 생성 */
  public async executeSettleMany(
    dto: CreateManyBroadcasterSettlementHistoryDto,
  ): Promise<number> {
    const { round: dtoRound, items } = dto;
    const today = dayjs().format('YYYY/MM');
    const round = `${today}/${dtoRound}차`;

    const broadcasterIds = Array.from(new Set(items.map((i) => i.broadcasterId)));

    await this.prisma.broadcasterSettlements.createMany({
      data: broadcasterIds.map((id) => ({ broadcasterId: id, round })),
      skipDuplicates: true,
    });

    const settlements = await this.prisma.broadcasterSettlements.findMany({
      where: { round },
    });

    const result = await this.prisma.broadcasterSettlementItems.createMany({
      data: items
        .map((i) => {
          const _settlement = settlements.find(
            (x) => x.broadcasterId === i.broadcasterId,
          );
          if (!_settlement) return null;
          return {
            amount: i.amount,
            exportCode: i.exportCode,
            liveShoppingId: i.liveShoppingId,
            productPromotionId: i.productPromotionId,
            // eslint-disable-next-line no-nested-ternary
            sellType: i.liveShoppingId
              ? SellType.liveShopping
              : i.productPromotionId
              ? SellType.broadcasterPromotionPage
              : ('normal' as any), // TODO: SellType 기본판매 추가시 타입 수정 필요
            orderId: i.orderId,
            broadcasterSettlementsId: _settlement.id,
            broadcasterCommissionRate: i.broadcasterCommissionRate,
          };
        })
        .filter((x) => !!x),
    });

    this._clearCaches(this.#BC_SETTLEMENT_HISTORY_CACHE_KEY);
    return result.count;
  }

  /** 특정 방송인 정산 내역 조회 */
  public async findHistoriesByBroadcaster(
    broadcasterId: Broadcaster['id'],
  ): Promise<FindBcSettlementHistoriesRes> {
    return this.prisma.broadcasterSettlements.findMany({
      where: { broadcasterId },
      orderBy: [{ round: 'desc' }, { date: 'desc' }],
      include: {
        broadcasterSettlementItems: {
          include: { liveShopping: true, productPromotion: true },
        },
        broadcaster: { select: { id: true, userNickname: true } },
      },
    });
  }

  /** 회차별 모든 방송인 정산 내역 조회 */
  public async findHistories(): Promise<FindBcSettlementHistoriesRes> {
    return this.prisma.broadcasterSettlements.findMany({
      orderBy: [{ round: 'desc' }, { date: 'desc' }],
      include: {
        broadcasterSettlementItems: {
          include: { liveShopping: true, productPromotion: true },
        },
        broadcaster: {
          select: { id: true, userNickname: true },
        },
      },
    });
  }

  /** 누적 정산 금액 조회 */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async findAccumulatedSettlementAmount(broadcasterId: Broadcaster['id']) {
    return this.prisma.broadcasterSettlementItems.aggregate({
      where: { settlements: { broadcasterId } },
      _sum: { amount: true },
    });
  }
}
