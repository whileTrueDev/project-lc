/* eslint-disable no-nested-ternary */
import { Injectable } from '@nestjs/common';
import { Prisma, SellCommission, Seller, SellType } from '@prisma/client';
import { UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  ExecuteSettlementDto,
  FmExport,
  SellerSettlementTargetRes,
} from '@project-lc/shared-types';
import {
  calcPgCommission,
  CalcPgCommissionOptions,
  checkOrderDuringLiveShopping,
} from '@project-lc/utils';
import dayjs from 'dayjs';

@Injectable()
export class SellerSettlementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 정산 처리를 진행합니다.
   * @author hwasurr(dan)
   * */
  public async executeSettle(
    id: UserPayload['id'],
    dto: ExecuteSettlementDto,
  ): Promise<boolean> {
    const { target, round } = dto;
    const { order_seq, shipping_cost } = target;

    // 출고가 발생한 주문을 통해 해당 주문에 대한 이전 정산 처리를 조회
    const settlementHistories = await this.findSettlementHistory(id, {
      order_seq,
    });

    // 이전 정산 정보를 바탕으로, 배송비 중복 부과 방지 처리 ( 배송비는 해당 order_shipping의 첫 출고에만 부과)
    let shippingCost = shipping_cost;
    let shippingCostIncluded = true;
    const targetShippingSeqs = target.options.map((x) => x.shipping_seq);
    const filtered = settlementHistories.find((h) => {
      return targetShippingSeqs.includes(h.shippingId);
    });
    if (filtered) {
      // 이 주문의 shipping_seq 에 대한 배송비를 이미 부과한 경우
      shippingCost = '0';
      shippingCostIncluded = false;
    }

    // 수수료 정보 조회
    const sellCommission = await this.findSellCommission();

    const totalInfo = target.options.reduce(
      (acc, curr) => {
        const ea = Number(acc.ea) + Number(curr.ea);
        const price = Number(acc.price) + Number(curr.price);

        // 라이브쇼핑인지 여부
        // 판매된 시각과 라이브쇼핑 판매기간을 비교해 포함되면 라이브쇼핑을 통한 구매로 판단
        const liveShopping = curr.LiveShopping.find((lvs) => {
          return checkOrderDuringLiveShopping(target, lvs);
        });
        // 상품홍보를 통한 정산대상인지 여부
        const productPromotion =
          curr.productPromotion.length > 0 ? curr.productPromotion[0] : null;

        let commission = Math.floor(price * Number(sellCommission.commissionDecimal));
        if (liveShopping || productPromotion) {
          let wtCommissionRate: Prisma.Decimal;
          let bcCommissionRate: Prisma.Decimal;
          if (liveShopping) {
            wtCommissionRate = liveShopping.whiletrueCommissionRate;
            bcCommissionRate = liveShopping.broadcasterCommissionRate;
          } else if (productPromotion) {
            wtCommissionRate = productPromotion.whiletrueCommissionRate;
            bcCommissionRate = productPromotion.broadcasterCommissionRate;
          }
          const wtCommission = Math.floor(price * (Number(wtCommissionRate) * 0.01));
          const brCommission = Math.floor(price * (Number(bcCommissionRate) * 0.01));
          commission = wtCommission + brCommission;
        }

        return {
          ea,
          price,
          commission,
        };
      },
      { ea: 0, price: 0, commission: 0 },
    );

    const totalPgCommission = this.calcPgCommission({
      paymentMethod: target.payment,
      pg: target.pg,
      targetAmount: totalInfo.price + Number(shippingCost),
    });

    // 주문정보 불러오기
    // 라이브쇼핑 주문의 경우, 일반 주문의 경우 분기처리
    const today = dayjs().format('YYYY/MM');
    await this.prisma.sellerSettlements.create({
      data: {
        exportId: target.export_seq,
        exportCode: target.export_code,
        orderId: String(target.order_seq),
        round: `${today}/${round}차`,
        shippingCost,
        shippingId: target.options[0].shipping_seq,
        startDate: target.export_date, // 출고일
        date: new Date(),
        doneDate: target.confirm_date, // 구매확정일
        buyer: target.order_user_name,
        recipient: target.recipient_user_name,
        paymentMethod: target.payment,
        pg: target.pg,
        pgCommission: totalPgCommission.commission,
        pgCommissionRate: totalPgCommission.rate,
        sellerId: target.options[0].seller.id,
        settlementItems: {
          create: target.options.map((opt) => {
            const price = Number(opt.price) * opt.ea;
            const liveShopping = opt.LiveShopping.find((lvs) => {
              return checkOrderDuringLiveShopping(target, lvs);
            });
            const productPromotion =
              opt.productPromotion.length > 0 ? opt.productPromotion[0] : null;
            const sellType = liveShopping
              ? SellType.liveShopping
              : productPromotion
              ? SellType.productPromotion
              : SellType.normal;
            // 수수료율 정보
            const wtCommissionRate = liveShopping
              ? liveShopping.whiletrueCommissionRate
              : productPromotion
              ? productPromotion.whiletrueCommissionRate
              : sellCommission.commissionRate;
            const wtCommission = Math.floor(0.01 * Number(wtCommissionRate) * price);
            const bcCommissionRate = liveShopping
              ? liveShopping.broadcasterCommissionRate
              : productPromotion
              ? productPromotion.broadcasterCommissionRate
              : 0;
            const bcCommission = Math.floor(0.01 * Number(bcCommissionRate) * price);

            return {
              itemId: opt.item_seq,
              goods_name: opt.goods_name,
              goods_image: opt.image,
              option_title: opt.title1,
              option1: opt.option1,
              optionId: opt.item_option_seq,
              ea: opt.ea,
              price,
              pricePerPiece: Number(opt.price),
              liveShoppingId: liveShopping ? liveShopping?.id : null,
              productPromotionId: productPromotion ? productPromotion.id : null,
              sellType,
              whiletrueCommissionRate: wtCommissionRate,
              broadcasterCommissionRate: bcCommissionRate,
              whiletrueCommission: wtCommission,
              broadcasterCommission: bcCommission,
            };
          }),
        },
        shippingCostIncluded,
        totalEa: totalInfo.ea,
        totalPrice: totalInfo.price,
        totalAmount:
          totalInfo.price -
          totalInfo.commission -
          totalPgCommission.commission +
          Number(shippingCost),
        totalCommission: totalInfo.commission + totalPgCommission.commission,
      },
    });

    return true;
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
      where: { sellerId, sellerSettlementItemsId: null },
      include: {
        items: {
          select: {
            id: true,
            orderItem: {
              select: {
                order: { select: { id: true, payment: { select: { method: true } } } },
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
                shippingCost: true,
                shippingCostIncluded: true,
              },
            },
            orderItemOption: true,
            amount: true,
            status: true,
          },
        },
        seller: {
          select: {
            sellerShop: { select: { shopName: true } },
            sellerSettlementAccount: true,
          },
        },
        order: { select: { recipientName: true, ordererName: true } },
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
      export_seq?: FmExport['export_seq'];
      order_seq?: FmExport['order_seq'];
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
