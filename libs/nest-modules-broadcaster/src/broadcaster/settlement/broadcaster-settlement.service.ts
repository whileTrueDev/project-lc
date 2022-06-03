import { Injectable } from '@nestjs/common';
import { Broadcaster, Export } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { BroadcasterSettlementTargets, FindManyDto } from '@project-lc/shared-types';
import { calcBcSettlementTotalInfo } from '@project-lc/utils';

@Injectable()
export class BroadcasterSettlementService {
  constructor(private readonly prisma: PrismaService) {}

  private async findAlreadySettled(
    broadcasterId: Broadcaster['id'],
  ): Promise<Export['exportCode'][]> {
    return this.prisma.broadcasterSettlementItems
      .findMany({
        select: { exportCode: true },
        where: { settlements: { broadcasterId } },
      })
      .then((r) => r.map((_) => _.exportCode));
  }

  /** 현재 정산 예정 금액 조회 */
  public async getReceivableAmount(broadcasterId: Broadcaster['id']): Promise<number> {
    const alreadySettled = await this.findAlreadySettled(broadcasterId);
    const targets = await this.prisma.exportItem.findMany({
      include: {
        export: true,
        orderItem: {
          select: {
            support: { select: { liveShopping: true, productPromotion: true } },
          },
        },
      },
      where: {
        export: { exportCode: { notIn: alreadySettled } },
        orderItem: {
          support: {
            broadcasterId,
            OR: [
              { liveShopping: { broadcasterId } },
              { productPromotion: { broadcasterId } },
            ],
          },
        },
      },
    });

    const total = calcBcSettlementTotalInfo({ items: targets });
    return total.settleAmount;
  }

  /**
   * 정산 대상 목록 조회
   * * 정산 대상이란: (방송인에게 support 처리된) 정산완료되지 않은 "구매 완료 상태의 출고 내역"
   *  */
  public async findSettlementTargets(
    broadcasterId?: Broadcaster['id'],
    paginationDto?: FindManyDto,
  ): Promise<BroadcasterSettlementTargets> {
    const alreadySettled = await this.findAlreadySettled(broadcasterId);
    const result = await this.prisma.export.findMany({
      include: {
        items: {
          include: {
            orderItem: {
              select: {
                order: {
                  select: {
                    id: true,
                    orderCode: true,
                    bundleFlag: true,
                    ordererName: true,
                    recipientName: true,
                  },
                },
                id: true,
                channel: true,
                support: {
                  include: {
                    broadcaster: {
                      select: { id: true, userNickname: true, avatar: true },
                    },
                    liveShopping: true,
                    productPromotion: true,
                  },
                },
                goods: {
                  select: {
                    id: true,
                    goods_name: true,
                    image: {
                      select: { image: true },
                      take: 1,
                      orderBy: { cut_number: 'asc' },
                    },
                  },
                },
              },
            },
            orderItemOption: true,
          },
        },
      },
      where: {
        exportCode: { notIn: alreadySettled },
        buyConfirmSubject: { not: null },
        buyConfirmDate: { not: null },
        order: {
          deleteFlag: false,
          supportOrderIncludeFlag: true,
          orderItems: {
            some: {
              support: broadcasterId
                ? { broadcasterId }
                : { broadcasterId: { not: null } },
            },
          },
        },
      },
      skip: paginationDto?.skip || 0,
      take: paginationDto?.take || 5,
    });

    return result;
  }
}
