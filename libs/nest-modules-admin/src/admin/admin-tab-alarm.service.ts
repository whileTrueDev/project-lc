import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { BroadcasterSettlementService } from '@project-lc/nest-modules-broadcaster';
import { SellerSettlementService } from '@project-lc/nest-modules-seller';
import { AdminNotiCountRes, LastCheckedDataRes } from '@project-lc/shared-types';

@Injectable()
export class AdminTabAlarmSevice {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settlementService: BroadcasterSettlementService,
    private readonly sellerSettlementService: SellerSettlementService,
  ) {}

  /** 관리자페이지 사이드바에 표시할 탭별 신규 데이터 개수 조회 */
  async getAdminNotiCounts(): Promise<AdminNotiCountRes> {
    const checkedData = await this.getLastCheckedData(); // router.pathname 값(admin pages 경로)을 키로 사용함

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
    // 정산 : 신규 정산 대상 목록 수에 따라 숫자 알림이 뜬다. (& 관리자가 확인한 마지막 데이터 이후 추가된)
    const latestCheckedbcSettlementTargetsId = checkedData?.['/broadcaster/settlement'];
    // BroadcasterSettlementService.findSettlementTargets 함수에서 export 조회할때와 동일한 where절을 사용한다 & 관리자가 확인한 마지막id보다 큰 데이터
    const bcSettlementTargets = await this.prisma.export.count({
      where: {
        broadcasterSettlementItems: null,
        buyConfirmSubject: { not: null },
        buyConfirmDate: { not: null },
        order: {
          deleteFlag: false,
          supportOrderIncludeFlag: true,
          orderItems: {
            some: {
              support: { broadcasterId: { not: null } },
            },
          },
        },
        id: latestCheckedbcSettlementTargetsId
          ? { gt: latestCheckedbcSettlementTargetsId }
          : undefined,
      },
    });

    // * 판매자  -------------------------------- *
    // 계좌정보 목록 : 신규 계좌 등록이 있을 경우 계좌수에 따라 숫자 알림이 뜬다.
    const latestCheckedSellerAccountId = checkedData?.['/seller/account'];
    const sellerAccounts = await this.prisma.sellerSettlementAccount.count({
      where: {
        id: latestCheckedSellerAccountId
          ? { gt: latestCheckedSellerAccountId }
          : undefined,
      },
    });
    // 사업자 등록정보 검수 : 검수상태가 ‘대기중’인 사업자 등록정보 수에 따라 숫자 알림이 뜬다.
    const latestCheckedSellerBusinessRegistrationId =
      checkedData?.['/seller/business-registration'];
    const sellerBusinessRegistration = await this.prisma.sellerBusinessRegistration.count(
      {
        where: {
          BusinessRegistrationConfirmation: { status: 'waiting' },
          id: latestCheckedSellerBusinessRegistrationId
            ? { gt: latestCheckedSellerBusinessRegistrationId }
            : undefined,
        },
      },
    );
    // 정산 : 신규 정산 대상 목록 수에 따라 숫자 알림이 뜬다.
    const latestCheckedSellerSettlementTargetId = checkedData?.['/seller/settlement'];
    const sellerSettlementTargets = await this.prisma.export.count({
      where: {
        sellerSettlementsId: null,
        id: latestCheckedSellerSettlementTargetId
          ? { gt: latestCheckedSellerSettlementTargetId }
          : undefined,
      },
    });

    // * 상품  -------------------------------- *
    // 상품목록/검수 : 검수 승인 ‘대기중’인 상품 수에 따라 숫자 알림이 뜬다.
    // => 관리자 상품검수목록은 필터적용시 id순으로 정렬되지 않음. 관리자가 확인한 마지막 id를 특정할 수 없어 검수 상태로만 알림개수를 구함
    const goods = await this.prisma.goods.count({
      where: { confirmation: { status: { in: ['waiting', 'needReconfirmation'] } } },
    });
    // 상품 문의 관리 : 답변이 필요한 문의 수에 따라 숫자 알림이 뜬다.
    // => 상품문의는 테이블형태로 표시되지 않음. 답변이 필요한 문의만 볼 수 있으므로 관리자가 확인한 마지막 데이터 id를 저장하지 않는다
    const goodsInquiry = await this.prisma.goodsInquiry.count({
      where: { status: 'requested' },
    });
    // * 라이브 쇼핑  -------------------------------- *
    // 신규 라이브 쇼핑 등록시 숫자 알림이 뜬다. => 신규 라이브쇼핑 등록시 status : registered
    const latestCheckedLiveShoppingtId = checkedData?.['/live-shopping'];
    const liveShopping = await this.prisma.liveShopping.count({
      where: {
        progress: 'registered',
        id: latestCheckedLiveShoppingtId
          ? { gt: latestCheckedLiveShoppingtId }
          : undefined,
      },
    });
    // * 주문  -------------------------------- *
    // 주문목록 : 신규 주문 건수에 따라 알림이 뜬다. (관리자가 알림 초기화로 )
    const latestCheckedOrderId = checkedData?.['/order/list'];
    const orders = await this.prisma.order.count({
      where: {
        id: latestCheckedOrderId ? { gt: latestCheckedOrderId } : undefined,
      },
    });
    // 환불요청 : 미승인 환불 목록 수에 따라 알림이 뜬다.
    // => 소비자의 환불요청이란, 물품반환 없는 반품요청이다.(현재 크크쇼는 물건 반품하는 절차가 없고 바로 환불만 받는다)
    // 기간필터가 존재하여 알림초기화를 위해 관리자가 마지막으로 확인한 데이터 id를 특정하기 어렵다
    const customerReturnRequest = await this.prisma.return.count({
      where: { NOT: { status: 'complete' } },
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
      '/order/list': orders,
      '/order/refund': customerReturnRequest,
      '/general/inquiry': generalInquiry,
    };
  }

  /** 관리자가 마지막으로 확인한 데이터 고유번호 저장 */
  async updateLastCheckedData(dto: Record<string, number>): Promise<boolean> {
    await this.prisma.adminLastCheckedData.update({
      where: { id: 1 },
      data: { data: dto },
    });
    return true;
  }

  /** 관리자가 마지막으로 확인한 데이터 고유번호 조회 */
  async getLastCheckedData(): Promise<LastCheckedDataRes> {
    const data = await this.prisma.adminLastCheckedData.findFirst();
    if (!data) return {};
    return JSON.parse(JSON.stringify(data.data));
  }
}
