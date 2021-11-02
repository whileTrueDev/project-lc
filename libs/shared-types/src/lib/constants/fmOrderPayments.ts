import { FmOrder } from '../res-types/fmOrder.res';

export const fmOrderPayments: Record<FmOrder['payment'], string> = {
  bank: '무통장입금',
  account: '계좌이체',
  card: '카드',
  cellphone: '휴대폰',
  escrow_account: '에스크로계좌이체',
  escrow_virtual: '에스크로가상계좌',
  kakaomoney: '카카오머니',
  virtual: '가상계좌',
  pay_later: 'pay_later',
  payco_coupon: 'payco_coupon',
  paypal: 'paypal',
  point: 'point',
  pos_pay: 'pos_pay',
};

export const convertFmOrderPaymentsToString = (
  key: keyof typeof fmOrderPayments,
): string => {
  return fmOrderPayments[key];
};
