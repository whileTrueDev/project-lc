import { Injectable } from '@nestjs/common';
import { Broadcaster, SellType } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateBcSettleHistoryWithExternalItemDto,
  CreateManyBroadcasterSettlementHistoryDto,
  FindBcSettlementHistoriesRes,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';

@Injectable()
export class BroadcasterSettlementHistoryService {
  constructor(private readonly prisma: PrismaService) {}

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
              ? SellType.productPromotion
              : SellType.normal,
            orderId: i.orderId,
            broadcasterSettlementsId: _settlement.id,
            broadcasterCommissionRate: i.broadcasterCommissionRate,
          };
        })
        .filter((x) => !!x),
    });

    // Export에 정산정보 연결 작업
    const exportCodes = items.map((i) => i.exportCode);
    const bcSettlemtItems = await this.prisma.broadcasterSettlementItems.findMany({
      where: { Export: null, exportCode: { in: exportCodes } },
    });
    await Promise.all(
      bcSettlemtItems.map((_item) => {
        return this.prisma.export.update({
          where: { exportCode: _item.exportCode },
          data: { broadcasterSettlementItems: { connect: { id: _item.id } } },
        });
      }),
    );

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

  public async createBcSettleHistoryWithExternalItem(
    dto: CreateBcSettleHistoryWithExternalItemDto,
  ): Promise<boolean> {
    const today = dayjs().format('YYYY/MM');
    const round = `${today}/${dto.round}차`;

    const existSettlement = await this.prisma.broadcasterSettlements.findFirst({
      where: { round, broadcasterId: dto.broadcasterId },
    });

    if (existSettlement) {
      await this.prisma.broadcasterSettlementItems.create({
        data: {
          amount: dto.amount,
          liveShoppingId: dto.liveShoppingId,
          broadcasterSettlementsId: existSettlement.id,
          sellType: 'liveShopping',
        },
      });
    } else {
      await this.prisma.broadcasterSettlements.create({
        data: {
          round,
          broadcasterId: dto.broadcasterId,
          broadcasterSettlementItems: {
            create: {
              amount: dto.amount,
              liveShoppingId: dto.liveShoppingId,
              sellType: 'liveShopping',
            },
          },
        },
      });
    }

    return true;
  }
}
