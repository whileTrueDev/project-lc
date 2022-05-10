import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';

@Injectable()
export class RefundService extends ServiceBaseWithCache {
  #REFUND_CACHE_KEY = 'refund';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  async fakePayment(): Promise<any> {
    const orderId = nanoid(6);
    const postData = {
      amount: 15000,
      orderId,
      orderName: '테스트주문',
      cardNumber: '4330123412341234',
      cardExpirationYear: '24',
      cardExpirationMonth: '07',
      cardPassword: '12',
      customerIdentityNumber: '881212',
    };
    const axiosConfig = {
      headers: {
        Authorization: 'Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==',
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post(
      'https://api.tosspayments.com/v1/payments/key-in',
      postData,
      axiosConfig,
    );
    return response.data;
  }

  async makeFakeOrderWithFakePayment(): Promise<any> {
    const paymentResultData = await this.fakePayment();

    const orderWithPayment = await this.prisma.order.create({
      data: {
        orderCode: paymentResultData.orderId,
        customer: { connect: { id: 1 } },
        step: 'paymentConfirmed',
        recipientName: '받는사람명',
        recipientPhone: '01012341234',
        recipientEmail: 'sjdkfl@sdf.com',
        recipientAddress: '받는사람ㅁ주소',
        recipientDetailAddress: '받는사람상세주소',
        recipientPostalCode: '23423',
        ordererName: '주문자명',
        ordererPhone: '0101231242',
        ordererEmail: 'sdlkfj@gasd.com',
        memo: '결제취소 api 테스트 위한 가짜 결제정보 담은 주문생성',
        orderPrice: paymentResultData.totalAmount,
        paymentPrice: paymentResultData.totalAmount,
        payment: {
          create: {
            method: 'card', // fakePayment가 카드결제라서 카드
            paymentKey: paymentResultData.paymentKey,
            depositDate: paymentResultData.approvedAt,
            depositDoneFlag: !!paymentResultData.approvedAt,
          },
        },
      },
    });

    return orderWithPayment;
  }

  /** 반품요청에 대한 환불처리
   * 1. 반품상품총합, 주문코드로 토스페이먼츠 결제취소 요청 dto, res -> 별도 함수로 작성
   * 2. 결과를 Refund, RefundItem으로 저장 dto, res
   */

  /** 환불내역 목록 조회 - 소비자, 판매자 */

  /** 특정 환불내역 상세 조회 */
}
