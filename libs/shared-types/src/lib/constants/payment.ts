import { PaymentMethod } from '@prisma/client';

export enum KKsPaymentProviders {
  /** 실 사용중 페이서비스 제공자 - 토스페이먼츠 https://www.tosspayments.com/ */
  TossPayments = 'TossPayments',
  /** 코드 이해를 위해 임시로 추가해둠. 현재 사용하지 않음 (220516 by hwasurr) https://developer.pay.naver.com/docs/v2/api */
  NaverPay = 'NaverPay',
}

export function convertPaymentMethodToKrString(paymentType?: PaymentMethod): string {
  switch (paymentType) {
    case 'card':
      return '카드';
    case 'virtualAccount':
      return '가상계좌';
    case 'transfer':
      return '계좌이체';
    default:
      return '';
  }
}
