import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { BroadcasterSettlementService } from '@project-lc/nest-modules-broadcaster';
import { SellerSettlementService } from '@project-lc/nest-modules-seller';
import { AdminNotiCountRes, LatestCheckedDataRes } from '@project-lc/shared-types';

@Injectable()
export class AdminTabAlarmSevice {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settlementService: BroadcasterSettlementService,
    private readonly sellerSettlementService: SellerSettlementService,
  ) {}

  /** 관리자페이지 사이드바에 표시할 탭별 신규 데이터 개수 조회 */
  async getAdminNotiCounts(): Promise<AdminNotiCountRes> {
    const checkedData = await this.getLatestCheckedData();

    // * 방송인  -------------------------------- *
    // 정산정보 검수 : 대기중인 방송인 수에 따라 숫자 알림이 뜬다. (& 관리자가 확인한 마지막 데이터 이후 추가된)
    const latestCheckedBcSettlementInfoId = checkedData?.['/broadcaster/settlement-info'];
    const bcSettlementInfo = await this.prisma.broadcasterSettlementInfo.count({
      where: {
        confirmation: { status: 'waiting' },
        id: latestCheckedBcSettlementInfoId
          ? { gt: latestCheckedBcSettlementInfoId }
          : undefined,
      },
    });
    // 정산 : 신규 정산 대상 목록 수에 따라 숫자 알림이 뜬다.
    const bcSettlementTargets = (await this.settlementService.findSettlementTargets())
      .length;

    // * 판매자  -------------------------------- *
    // 계좌정보 목록 : 신규 계좌 등록이 있을 경우 계좌수에 따라 숫자 알림이 뜬다.
    // TODO: 판매자 계좌 정보는 검수x => 관리자가 확인한 id 이후의 개수
    const sellerAccounts = 0;
    // 사업자 등록정보 검수 : 검수상태가 ‘대기중’인 사업자 등록정보 수에 따라 숫자 알림이 뜬다.
    const sellerBusinessRegistration = await this.prisma.sellerBusinessRegistration.count(
      {
        where: { confirmHistory: { some: { status: 'waiting' } } },
      },
    );
    // 정산 : 신규 정산 대상 목록 수에 따라 숫자 알림이 뜬다.
    const sellerSettlementTargets = (
      await this.sellerSettlementService.findAllSettleTargetList()
    ).length;

    // * 상품  -------------------------------- *
    // 상품목록/검수 : 검수 승인 ‘대기중’인 상품 수에 따라 숫자 알림이 뜬다.
    const goods = await this.prisma.goods.count({
      where: { confirmation: { status: { in: ['waiting', 'needReconfirmation'] } } },
    });
    // 상품 문의 관리 : 답변이 필요한 문의 수에 따라 숫자 알림이 뜬다.
    const goodsInquiry = await this.prisma.goodsInquiry.count({
      where: { status: 'requested' },
    });
    // * 라이브 쇼핑  -------------------------------- *
    // 신규 라이브 쇼핑 등록시 숫자 알림이 뜬다. => 신규 라이브쇼핑 등록시 status : registered
    const liveShopping = await this.prisma.liveShopping.count({
      where: { progress: 'registered' },
    });
    // * 주문  -------------------------------- *
    // 결제 취소 요청 : 신규 결제 취소 요청 수에 따라 알림이 뜬다. => 판매자의 결제취소요청
    const sellerOrderCancelRequest = await this.prisma.sellerOrderCancelRequest.count({
      where: { status: 'waiting' },
    });
    // 주문목록 : 신규 주문 건수에 따라 알림이 뜬다.
    // TODO: 관리자가 확인한 이후 주문목록 개수
    const orders = 0;
    // 환불요청 : 미승인 환불 목록 수에 따라 알림이 뜬다.
    // => 소비자의 환불요청이란, 물품반환 없는 반품요청이다.(현재 크크쇼는 물건 반품하는 절차가 없고 바로 환불만 받는다)
    const customerReturnRequest = await this.prisma.return.count({
      where: { status: { in: ['requested', 'canceled'] } },
    });
    // * 일반 관리  -------------------------------- *
    // 문의하기 : 신규 문의 수에 따라 숫자 알림이 뜬다.
    const generalInquiry = await this.prisma.inquiry.count({
      where: { readFlag: false },
    });

    // { [adminSidebarMenuList 의 href] : 개수 } 형태로 리턴
    return {
      '/broadcaster/settlement-info': bcSettlementInfo,
      '/broadcaster/settlement': bcSettlementTargets,
      '/seller/account': sellerAccounts,
      '/seller/business-registration': sellerBusinessRegistration,
      '/seller/settlement': sellerSettlementTargets,
      '/goods/confirmation': goods,
      '/goods/inquiry': goodsInquiry,
      '/live-shopping': liveShopping,
      '/order/order-cancel': sellerOrderCancelRequest,
      '/order/list': orders,
      '/order/refund': customerReturnRequest,
      '/general/inquiry': generalInquiry,
    };
  }

  async updateLatestCheckedData(dto: Record<string, number>): Promise<boolean> {
    await this.prisma.adminLatestCheckedData.update({
      where: { id: 1 },
      data: { data: dto },
    });
    return true;
  }

  async getLatestCheckedData(): Promise<LatestCheckedDataRes> {
    const data = await this.prisma.adminLatestCheckedData.findFirst();
    if (!data) return {};
    return JSON.parse(JSON.stringify(data.data));
  }
}
