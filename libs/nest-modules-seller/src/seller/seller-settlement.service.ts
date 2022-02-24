/* eslint-disable no-nested-ternary */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  BusinessRegistrationConfirmation,
  Prisma,
  SellCommission,
  SellerBusinessRegistration,
  SellerSettlementAccount,
  SellType,
  Seller,
  InactiveBusinessRegistrationConfirmation,
} from '@prisma/client';
import { ServiceBaseWithCache, UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BusinessRegistrationDto,
  ExecuteSettlementDto,
  FindSettlementHistoryRoundRes,
  FmExport,
  SellerBusinessRegistrationType,
  SettlementAccountDto,
} from '@project-lc/shared-types';
import {
  calcPgCommission,
  CalcPgCommissionOptions,
  checkOrderDuringLiveShopping,
} from '@project-lc/utils';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { SellerService } from './seller.service';

export type SellerSettlementInfo = {
  sellerBusinessRegistration: SellerBusinessRegistrationType[];
  sellerSettlements: {
    date: Date;
    state: number;
    totalAmount: number;
  }[];
  sellerSettlementAccount: Array<
    Pick<SellerSettlementAccount, 'bank' | 'number' | 'name'>
  >;
};

@Injectable()
export class SellerSettlementService extends ServiceBaseWithCache {
  #SELLER_SETTLEMENT_CACHE_KEY = 'seller/settlement';
  #SELLER_SETTLEMENT_HISTORY_CACHE_KEY = 'seller/settlement-history';

  constructor(
    private readonly prisma: PrismaService,
    private readonly sellerService: SellerService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  // 사업자 등록증 번호 포맷만들기
  private makeRegistrationNumberFormat(num: string): string {
    // 10자리의 문자열 -> '3-2-5'문자열
    return `${num.slice(0, 3)}-${num.slice(3, 5)}-${num.slice(5)}`;
  }

  /**
   * 사업자 등록증 등록
   * @param dto 사업자 등록증 등록 정보
   * @param sellerInfo 사용자 등록 정보
   */
  async insertBusinessRegistration(
    dto: BusinessRegistrationDto,
    sellerInfo: UserPayload,
  ): Promise<SellerBusinessRegistration> {
    const email = sellerInfo.sub;
    const sellerId = sellerInfo.id;
    const sellerBusinessRegistration =
      await this.prisma.sellerBusinessRegistration.create({
        data: {
          companyName: dto.companyName,
          sellerEmail: email,
          businessRegistrationNumber: this.makeRegistrationNumberFormat(
            dto.businessRegistrationNumber,
          ),
          representativeName: dto.representativeName,
          businessType: dto.businessType,
          businessItem: dto.businessItem,
          businessAddress: dto.businessAddress,
          taxInvoiceMail: dto.taxInvoiceMail,
          businessRegistrationImageName: dto.businessRegistrationImageName,
          mailOrderSalesImageName: dto.mailOrderSalesImageName,
          mailOrderSalesNumber: dto.mailOrderSalesNumber,
          sellerId,
        },
      });
    await this._clearCaches(this.#SELLER_SETTLEMENT_CACHE_KEY);
    return sellerBusinessRegistration;
  }

  /**
   * 휴면 사업자 등록증 confirmation 상태 복구
   * @param sellerId
   */

  public async restoreInactiveBusinessRegistrationConfirmation(
    sellerId: Seller['id'],
  ): Promise<BusinessRegistrationConfirmation | null> {
    const restoreData = await this.prisma.inactiveSellerBusinessRegistration.findFirst({
      where: {
        sellerId,
      },
      select: {
        InactiveBusinessRegistrationConfirmation: {
          select: {
            id: true,
            status: true,
            rejectionReason: true,
            InactiveSellerBusinessRegistrationId: true,
          },
        },
      },
    });

    if (restoreData?.InactiveBusinessRegistrationConfirmation) {
      return this.prisma.businessRegistrationConfirmation.create({
        data: {
          id: restoreData.InactiveBusinessRegistrationConfirmation.id,
          status: restoreData.InactiveBusinessRegistrationConfirmation.status,
          rejectionReason:
            restoreData.InactiveBusinessRegistrationConfirmation.rejectionReason,
          SellerBusinessRegistrationId:
            restoreData.InactiveBusinessRegistrationConfirmation
              .InactiveSellerBusinessRegistrationId,
        },
      });
    }
    return null;
  }

  /**
   * 휴면 사업자 등록증 confirmation 삭제
   * @param sellerId
   */

  public async deleteInactiveBusinessRegistrationConfirmation(
    registrationId: number,
  ): Promise<InactiveBusinessRegistrationConfirmation> {
    return this.prisma.inactiveBusinessRegistrationConfirmation.delete({
      where: {
        InactiveSellerBusinessRegistrationId: registrationId,
      },
    });
  }

  /**
   * 휴면 사업자 등록증 복구
   * @param dto 사업자 등록증 등록 정보
   * @param sellerInfo 사용자 등록 정보
   */
  public async restoreInactiveBusinessRegistration(
    sellerId: Seller['id'],
  ): Promise<void> {
    const restoreData = await this.prisma.inactiveSellerBusinessRegistration.findFirst({
      where: {
        sellerId,
      },
    });
    if (restoreData) {
      await this.prisma.sellerBusinessRegistration.create({
        data: {
          id: restoreData.id,
          companyName: restoreData.companyName,
          sellerEmail: restoreData.sellerEmail,
          businessRegistrationNumber: this.makeRegistrationNumberFormat(
            restoreData.businessRegistrationNumber,
          ),
          representativeName: restoreData.representativeName,
          businessType: restoreData.businessType,
          businessItem: restoreData.businessItem,
          businessAddress: restoreData.businessAddress,
          taxInvoiceMail: restoreData.taxInvoiceMail,
          businessRegistrationImageName: restoreData.businessRegistrationImageName,
          mailOrderSalesImageName: restoreData.mailOrderSalesImageName,
          mailOrderSalesNumber: restoreData.mailOrderSalesNumber,
          sellerId,
        },
      });
    }

    await this._clearCaches(this.#SELLER_SETTLEMENT_CACHE_KEY);
  }

  /**
   * 정산 정보 등록 후, 검수 정보를 위한 테이블에 레코드 추가
   * 정산 정보 등록 후 autoincrement되는 id 번호를 사용해야하므로 등록 과정 이후 진행
   * @param sellerBusinessRegistration 삽입된 사업자 등록 정보
   */
  async insertBusinessRegistrationConfirmation(
    _sellerBusinessRegistration: SellerBusinessRegistration,
  ): Promise<BusinessRegistrationConfirmation> {
    const businessRegistrationConfirmation =
      await this.prisma.businessRegistrationConfirmation.create({
        data: {
          SellerBusinessRegistrationId: _sellerBusinessRegistration.id,
        },
      });
    await this._clearCaches(this.#SELLER_SETTLEMENT_CACHE_KEY);
    return businessRegistrationConfirmation;
  }

  /**
   * 정산 계좌 등록
   * @param dto 정산 계좌 정보
   * @param sellerInfo 사용자 등록 정보
   */
  async insertSettlementAccount(
    dto: SettlementAccountDto,
    sellerInfo: UserPayload,
  ): Promise<SellerSettlementAccount> {
    const email = sellerInfo.sub;
    const sellerId = sellerInfo.id;
    const settlementAccount = await this.prisma.sellerSettlementAccount.create({
      data: {
        sellerEmail: email,
        sellerId,
        name: dto.name,
        number: dto.number,
        bank: dto.bank,
        settlementAccountImageName: dto.settlementAccountImageName,
      },
    });

    await this._clearCaches(this.#SELLER_SETTLEMENT_CACHE_KEY);
    return settlementAccount;
  }

  /**
   * 정산 계좌 등록
   * @param dto 정산 계좌 정보
   * @param sellerInfo 사용자 등록 정보
   */
  public async restoreSettlementAccount(sellerId: Seller['id']): Promise<void> {
    const restoreData = await this.prisma.inactiveSellerSettlementAccount.findFirst({
      where: {
        sellerId,
      },
    });

    if (restoreData) {
      await this.prisma.sellerSettlementAccount.create({
        data: {
          sellerId: restoreData.sellerId,
          name: restoreData.name,
          number: restoreData.number,
          bank: restoreData.bank,
          settlementAccountImageName: restoreData.settlementAccountImageName,
          sellerEmail: restoreData.sellerEmail,
        },
      });
    }

    await this._clearCaches(this.#SELLER_SETTLEMENT_CACHE_KEY);
  }

  /**
   * 정산 정보 조회
   * @param sellerInfo 사용자 등록 정보
   */
  async selectSellerSettlementInfo(
    sellerInfo: UserPayload,
  ): Promise<SellerSettlementInfo> {
    const email = sellerInfo.sub;
    const settlementInfo = await this.prisma.seller.findUnique({
      where: { email },
      select: {
        sellerBusinessRegistration: {
          include: { BusinessRegistrationConfirmation: true },
          take: 1,
          orderBy: { id: 'desc' },
        },
        sellerSettlements: {
          take: 5,
          orderBy: { id: 'desc' },
          select: { date: true, state: true, totalAmount: true },
        },
        sellerSettlementAccount: {
          take: 1,
          orderBy: { id: 'desc' },
          select: { bank: true, number: true, name: true },
        },
      },
    });

    return settlementInfo;
  }

  // *****************************
  // * 👇 실제 정산 처리 관련
  // *****************************

  /**
   * 정산 처리를 진행합니다.
   * @author hwasurr(dan)
   * */
  public async executeSettle(
    email: UserPayload['sub'],
    dto: ExecuteSettlementDto,
  ): Promise<boolean> {
    const { target, round } = dto;
    const { order_seq, shipping_cost } = target;

    // 출고가 발생한 주문을 통해 해당 주문에 대한 이전 정산 처리를 조회
    const settlementHistories = await this.findSettlementHistory(email, {
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
        sellerEmail: target.options[0].seller.email,
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

    await this._clearCaches(this.#SELLER_SETTLEMENT_HISTORY_CACHE_KEY);

    return true;
  }

  /** 정산 정보에 기반하여 정산을 진행할 총금액에서 전자결제 수수료를 계산합니다. */
  private calcPgCommission(
    opts: CalcPgCommissionOptions,
  ): ReturnType<typeof calcPgCommission> {
    return calcPgCommission(opts);
  }

  /** 정산 고정 수수료 정보를 조회힙니다. */
  public async findSellCommission(): Promise<SellCommission> {
    return this.prisma.sellCommission.findFirst({ orderBy: { id: 'desc' } });
  }

  /** 정산완료 데이터의 년도 목록 조회 */
  public async findSettlementHistoryYears(email: UserPayload['sub']): Promise<string[]> {
    const result: { year: string }[] = await this.prisma.$queryRaw`
    SELECT YEAR(round) AS year FROM SellerSettlements WHERE sellerEmail = ${email} GROUP BY YEAR(round)
    `;

    return result.map((m) => m.year);
  }

  /** 정산완료 데이터의 월 목록 조회 */
  public async findSettlementHistoryMonths(
    email: UserPayload['sub'],
    year: string,
  ): Promise<string[]> {
    const result: { month: string }[] = await this.prisma.$queryRaw`
    SELECT MONTH(round) AS month FROM SellerSettlements
    WHERE round LIKE ${`${year}/%`} AND sellerEmail = ${email} GROUP BY MONTH(round)
    `;

    return result.map((m) => m.month);
  }

  /** 정산완료 데이터의 회차 목록 조회 */
  public async findSettlementHistoryRounds(
    email: UserPayload['sub'],
    year: string,
    month: string,
  ): Promise<string[]> {
    const result: { round: string }[] = await this.prisma.$queryRaw`
      SELECT round FROM SellerSettlements
      WHERE round LIKE ${`${year}/${
        month.length === 1 ? `0${month}` : month
      }%`} AND sellerEmail = ${email} GROUP BY round
      `;

    return result.map((m) => m.round);
  }

  /** 정산 완료 목록의 round를 기준으로 groupby 조회를 실시합니다. */
  public async findSettlementHistoryPerRound(
    email: UserPayload['sub'],
  ): Promise<FindSettlementHistoryRoundRes> {
    const result = await this.prisma.sellerSettlements.groupBy({
      by: ['round'],
      where: { sellerEmail: email },
      _sum: {
        totalPrice: true,
        totalAmount: true,
        totalCommission: true,
        pgCommission: true,
        totalEa: true,
        shippingCost: true,
      },
    });

    return result;
  }

  /**
   * 정산 완료 목록을 조회합니다.
   * @author hwasurr(dan)
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async findSettlementHistory(
    email?: UserPayload['sub'],
    options?: {
      round?: string;
      export_seq?: FmExport['export_seq'];
      order_seq?: FmExport['order_seq'];
    },
  ) {
    return this.prisma.sellerSettlements.findMany({
      where: {
        sellerEmail: email || undefined,
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
}
