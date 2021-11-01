import { Injectable } from '@nestjs/common';
import {
  BusinessRegistrationConfirmation,
  Prisma,
  SellCommission,
  SellerBusinessRegistration,
  SellerSettlementAccount,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BusinessRegistrationDto,
  ExecuteSettlementDto,
  FindSettlementHistoryRoundRes,
  FmExport,
  FmOrder,
  SellerBusinessRegistrationType,
  SettlementAccountDto,
} from '@project-lc/shared-types';
import { checkOrderDuringLiveShopping } from '@project-lc/utils';
import dayjs from 'dayjs';
import { UserPayload } from '../auth/auth.interface';

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
export class SellerSettlementService {
  constructor(private readonly prisma: PrismaService) {}

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
        },
      });
    return sellerBusinessRegistration;
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
    const settlementAccount = await this.prisma.sellerSettlementAccount.create({
      data: {
        sellerEmail: email,
        name: dto.name,
        number: dto.number,
        bank: dto.bank,
        settlementAccountImageName: dto.settlementAccountImageName,
      },
    });

    return settlementAccount;
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
      where: {
        email,
      },
      select: {
        sellerBusinessRegistration: {
          include: {
            BusinessRegistrationConfirmation: true,
          },
          take: 1,
          orderBy: {
            id: 'desc',
          },
        },
        sellerSettlements: {
          take: 5,
          orderBy: {
            id: 'desc',
          },
          select: {
            date: true,
            state: true,
            totalAmount: true,
          },
        },
        sellerSettlementAccount: {
          take: 1,
          orderBy: {
            id: 'desc',
          },
          select: {
            bank: true,
            number: true,
            name: true,
          },
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
    // 출고가 발생한 주문을 통해 해당 주문에 대한 이전 정산 처리를 조회
    const { order_seq, shipping_cost, payment } = target;
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

        let commission = price * Number(sellCommission.commissionDecimal);
        if (liveShopping) {
          const { whiletrueCommissionRate, broadcasterCommissionRate } = liveShopping;
          const wtCommission = Math.floor(
            price * (Number(whiletrueCommissionRate) * 0.01),
          );
          const brCommission = Math.floor(
            price * (Number(broadcasterCommissionRate) * 0.01),
          );

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
      targetAmount: totalInfo.price,
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
        settlementItems: {
          create: target.options.map((opt) => {
            const liveShopping = opt.LiveShopping.find((lvs) => {
              return checkOrderDuringLiveShopping(target, lvs);
            });

            return {
              itemId: opt.item_seq,
              goods_name: opt.goods_name,
              goods_image: opt.image,
              option_title: opt.title1,
              option1: opt.option1,
              optionId: opt.item_option_seq,
              ea: opt.ea,
              price: Number(opt.price) * opt.ea,
              pricePerPiece: Number(opt.price),
              liveShoppingId: liveShopping ? liveShopping?.id : null,
              whiletrueCommissionRate: liveShopping
                ? liveShopping?.whiletrueCommissionRate
                : 0,
              broadcasterCommissionRate: liveShopping
                ? liveShopping?.broadcasterCommissionRate
                : 0,
              whiletrueCommission: liveShopping
                ? Math.floor(
                    0.01 *
                      Number(liveShopping?.whiletrueCommissionRate) *
                      (Number(opt.price) * opt.ea),
                  )
                : Math.floor(
                    Number(opt.price) * opt.ea * Number(sellCommission.commissionDecimal),
                  ),
              broadcasterCommission: liveShopping
                ? Math.floor(
                    0.01 *
                      Number(liveShopping?.broadcasterCommissionRate) *
                      (Number(opt.price) * opt.ea),
                  )
                : 0,
            };
          }),
        },
        shippingCostIncluded,
        totalEa: totalInfo.ea,
        totalPrice: totalInfo.price,
        totalAmount:
          totalInfo.price - totalInfo.commission - totalPgCommission.commission,
        totalCommission: totalInfo.commission,
      },
    });

    return true;
  }

  /** 정산 정보에 기반하여 정산을 진행할 총금액에서 전자결제 수수료를 계산합니다. */
  private calcPgCommission(opts: {
    pg: FmOrder['pg'];
    paymentMethod: FmOrder['payment'];
    targetAmount: number;
  }): { commission: number; rate: string } {
    const { pg, paymentMethod, targetAmount } = opts;
    if (pg === 'npay' || pg === 'npg') {
      switch (paymentMethod) {
        case 'virtual': // 가상계좌 1%, 최대 275원
        case 'bank': {
          // 무통장입금 1%, 최대 275원
          const fee = targetAmount * (1 / 100);
          return { commission: fee > 275 ? 0 : fee, rate: '1.00%(최대275원)' };
        }
        case 'card': // 카드결제
          return { commission: targetAmount * (2.2 / 100), rate: '2.2%' };
        case 'point': // 네이버페이 포인트
          return { commission: targetAmount * (3.74 / 100), rate: '3.74%' };
        case 'cellphone': // 휴대폰 결제
          return { commission: targetAmount * (3.85 / 100), rate: '3.85%' };
        default:
      }
    }
    switch (paymentMethod) {
      case 'account': // 계좌입금
        return { commission: targetAmount * (1.98 / 100), rate: '1.98%' };
      case 'virtual': // 가상계좌 (고정수수료)
        return { commission: 330, rate: '330원고정' };
      case 'cellphone': // 휴대폰결제
        return { commission: targetAmount * (3.85 / 100), rate: '3.85%' };
      case 'bank': // 무통장입금
      default:
        return { commission: 0, rate: '0' };
    }
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
    WHERE round LIKE ${`${year}/${month}%`} AND sellerEmail = ${email} GROUP BY round
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
        seller: {
          include: {
            sellerShop: true,
          },
        },
        settlementItems: {
          include: {
            liveShopping: true,
          },
        },
      },
    });
  }
}
