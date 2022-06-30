import { KKsPaymentProviders, TossPaymentCancelDto } from '@project-lc/shared-types';

/** Payment프로바이더별 DTO 맵 { TossPayments:{ ...TossDto }, NaverPay: { ...NaverDto} } */
export type IPaymentCancelKeyMap = Record<
  KKsPaymentProviders.TossPayments,
  TossPaymentCancelDto
> &
  Record<KKsPaymentProviders.NaverPay, { dtoExampleField: unknown }>;

/** Payment프로바이더별 결제 취소 DTO */
export type PaymentCancelDto<T extends KKsPaymentProviders> = IPaymentCancelKeyMap[T];
