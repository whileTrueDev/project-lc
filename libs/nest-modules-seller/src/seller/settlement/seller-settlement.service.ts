/* eslint-disable no-nested-ternary */
import { Injectable } from '@nestjs/common';
import { SellCommission, Seller, SellType } from '@prisma/client';
import { UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  ExecuteSettlementDto,
  SellerSettlementTargetRes,
} from '@project-lc/shared-types';
import { calcPgCommission, CalcPgCommissionOptions } from '@project-lc/utils';
import dayjs from 'dayjs';

@Injectable()
export class SellerSettlementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 정산 처리를 진행합니다.
   * @author hwasurr(dan)
   * */
  public async executeSettle(dto: ExecuteSettlementDto): Promise<boolean> {
    const sellCommission = await this.findSellCommission();
    const totalInfo = dto.items.reduce(
      (acc, curr) => {
        const ea = Number(acc.ea) + Number(curr.ea);
        const price = Number(acc.price) + Number(curr.price);

        let commission = Math.floor(price * Number(sellCommission.commissionDecimal));
        if (
          curr.sellType === SellType.liveShopping ||
          curr.sellType === SellType.productPromotion
        ) {
          commission = curr.broadcasterCommission + curr.whiletrueCommission;
        }
        return { ea, price, commission };
      },
      { ea: 0, price: 0, commission: 0 },
    );

    // 출고고유번호로 출고상품 조회 -> 출고상품에 연결된 주문상품의 배송비정보(OrderShipping) 찾기
    const sellerExportItem = await this.prisma.exportItem.findFirst({
      where: {
        export: { id: dto.exportId },
      },
      select: {
        orderItem: { select: { orderShipping: true } },
      },
    });
    const shipping = sellerExportItem.orderItem.orderShipping;
    const shippingId = shipping ? shipping.id : 0; // 출고상품이 포함된 OrderShipping 고유번호(id) 찾기
    const shippingCost = shipping ? shipping.shippingCost : 0; // 출고상품이 포함된 OrderShipping의 배송비

    // 주문정보 불러오기
    // 라이브쇼핑 주문의 경우, 일반 주문의 경우 분기처리
    const today = dayjs().format('YYYY/MM');
    const result = await this.prisma.sellerSettlements.create({
      data: {
        exportId: dto.exportId,
        exportCode: dto.exportCode,
        orderId: String(dto.orderId),
        round: `${today}/${dto.round}차`,
        shippingCost,
        shippingId,
        startDate: dto.startDate,
        date: new Date(),
        doneDate: dto.doneDate, // 구매확정일
        buyer: dto.buyer,
        recipient: dto.recipient,
        paymentMethod: dto.paymentMethod,
        pg: dto.pg,
        pgCommission: dto.pgCommission,
        pgCommissionRate: dto.pgCommissionRate,
        sellerId: dto.sellerId,
        settlementItems: {
          create: dto.items.map((item) => {
            return {
              itemId: item.itemId,
              goods_name: item.goods_name,
              goods_image: item.goods_image,
              option_title: item.option_title,
              option1: item.option1,
              optionId: item.optionId,
              ea: item.ea,
              price: item.price,
              pricePerPiece: Number(item.pricePerPiece),
              liveShoppingId: item.liveShoppingId,
              productPromotionId: item.productPromotionId,
              sellType: item.sellType,
              whiletrueCommissionRate: item.whiletrueCommissionRate,
              broadcasterCommissionRate: item.broadcasterCommissionRate,
              whiletrueCommission: item.whiletrueCommission || 0,
              broadcasterCommission: item.broadcasterCommission || 0,
            };
          }),
        },
        totalEa: totalInfo.ea,
        totalPrice: totalInfo.price,
        totalAmount: totalInfo.price - totalInfo.commission,
        totalCommission: totalInfo.commission,
        Export: { connect: { exportCode: dto.exportCode } },
      },
    });
    return !!result;
  }

  /** 정산 고정 수수료 정보를 조회힙니다. */
  public async findSellCommission(): Promise<SellCommission> {
    return this.prisma.sellCommission.findFirst({ orderBy: { id: 'desc' } });
  }

  /** 정산완료 데이터의 년도 목록 조회 */
  public async findSettlementHistoryYears(
    sellerId: UserPayload['id'],
  ): Promise<string[]> {
    const result: { year: string }[] = await this.prisma.$queryRaw`
    SELECT YEAR(round) AS year FROM SellerSettlements WHERE sellerId = ${sellerId} GROUP BY YEAR(round)
    `;

    return result.map((m) => m.year);
  }

  /** 정산완료 데이터의 월 목록 조회 */
  public async findSettlementHistoryMonths(
    sellerId: UserPayload['id'],
    year: string,
  ): Promise<string[]> {
    const result: { month: string }[] = await this.prisma.$queryRaw`
    SELECT MONTH(round) AS month FROM SellerSettlements
    WHERE round LIKE ${`${year}/%`} AND sellerId = ${sellerId} GROUP BY MONTH(round)
    `;

    return result.map((m) => m.month);
  }

  /** 정산완료 데이터의 회차 목록 조회 */
  public async findSettlementHistoryRounds(
    sellerId: UserPayload['id'],
    year: string,
    month: string,
  ): Promise<string[]> {
    const result: { round: string }[] = await this.prisma.$queryRaw`
      SELECT round FROM SellerSettlements
      WHERE round LIKE ${`${year}/${
        month.length === 1 ? `0${month}` : month
      }%`} AND sellerId = ${sellerId} GROUP BY round
      `;

    return result.map((m) => m.round);
  }

  /**
   * 정산 대상을 조회합니다.
   * @author hwasurr(dan)
   */
  public async findAllSettleTargetList(
    sellerId?: Seller['id'],
  ): Promise<SellerSettlementTargetRes> {
    return this.prisma.export.findMany({
      where: { sellerId, sellerSettlementsId: null },
      orderBy: { id: 'desc' },
      include: {
        items: {
          select: {
            id: true,
            orderItem: {
              select: {
                channel: true,
                goods: {
                  select: {
                    id: true,
                    goods_name: true,
                    image: { take: 1, select: { id: true, image: true } },
                  },
                },
                support: {
                  select: {
                    liveShopping: {
                      select: {
                        id: true,
                        liveShoppingName: true,
                        whiletrueCommissionRate: true,
                        broadcasterCommissionRate: true,
                      },
                    },
                    productPromotion: {
                      select: {
                        id: true,
                        whiletrueCommissionRate: true,
                        broadcasterCommissionRate: true,
                      },
                    },
                    broadcaster: {
                      select: {
                        id: true,
                        userNickname: true,
                        userName: true,
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
            orderItemOption: true,
            quantity: true,
            status: true,
          },
        },
        seller: {
          select: {
            email: true,
            name: true,
            sellerShop: { select: { shopName: true } },
            sellerSettlementAccount: true,
          },
        },
        order: {
          select: {
            id: true,
            recipientName: true,
            ordererName: true,
            supportOrderIncludeFlag: true,
            createDate: true,
            payment: { select: { method: true } },
          },
        },
      },
    });
  }

  /**
   * 정산 완료 목록을 조회합니다.
   * @author hwasurr(dan)
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async findSettlementHistory(
    id?: UserPayload['id'],
    options?: {
      round?: string;
      export_seq?: number;
      order_seq?: number | string;
    },
  ) {
    return this.prisma.sellerSettlements.findMany({
      where: {
        sellerId: id || undefined,
        exportId: options && options.export_seq ? options.export_seq : undefined,
        orderId: options && options.order_seq ? String(options.order_seq) : undefined,
        round: options?.round ? options.round : undefined,
      },
      include: {
        seller: { include: { sellerShop: true } },
        settlementItems: { include: { liveShopping: true } },
      },
    });
  }

  /** 정산 정보에 기반하여 정산을 진행할 총금액에서 전자결제 수수료를 계산합니다. */
  private calcPgCommission(
    opts: CalcPgCommissionOptions,
  ): ReturnType<typeof calcPgCommission> {
    return calcPgCommission(opts);
  }
}

export default SellerSettlementService;
