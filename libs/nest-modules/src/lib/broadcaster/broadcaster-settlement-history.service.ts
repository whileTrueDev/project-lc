import { Injectable } from '@nestjs/common';
import { Broadcaster } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateManyBroadcasterSettlementHistoryDto,
  FindBCSettlementHistoriesRes,
} from '@project-lc/shared-types';

@Injectable()
export class BroadcasterSettlementHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 정산 내역 일괄 생성 */
  public async executeSettleMany(
    dto: CreateManyBroadcasterSettlementHistoryDto,
  ): Promise<number> {
    const { round, items } = dto;

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
            orderId: i.orderId,
            broadcasterSettlementsId: _settlement.id,
          };
        })
        .filter((x) => !!x),
    });

    return result.count;
  }

  /** 특정 방송인 정산 내역 조회 */
  public async findHistories(
    broadcasterId: Broadcaster['id'],
  ): Promise<FindBCSettlementHistoriesRes> {
    return this.prisma.broadcasterSettlements.findMany({
      where: { broadcasterId },
      orderBy: { round: 'desc' },
      include: {
        broadcasterSettlementItems: true,
      },
    });
  }
}
