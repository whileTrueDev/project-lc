import { PaymentMethod } from '@prisma/client';

export type CalcPgCommissionOptions = {
  pg: 'tossPayments';
  paymentMethod: PaymentMethod;
  /** 배송비에 대한 정산이 필요한 경우, 배송비가 포함된 총 결제금액 */
  targetAmount: number;
};
/** 정산 정보에 기반하여 정산을 진행할 총금액에서 전자결제 수수료를 계산합니다. */
export function calcPgCommission(opts: CalcPgCommissionOptions): {
  commission: number;
  rate: string;
  description: string;
} {
  // const { pg, paymentMethod, targetAmount } = opts;
  // if (pg === 'npay' || pg === 'npg') {
  //   switch (paymentMethod) {
  //     case 'virtual': // 가상계좌 1%, 최대 275원
  //     case 'bank': {
  //       // 무통장입금 1%, 최대 275원
  //       const fee = targetAmount * (1 / 100);
  //       return {
  //         commission: fee > 275 ? 275 : Math.floor(fee),
  //         rate: '1.00',
  //         description: '% (최대275원)',
  //       };
  //     }
  //     case 'card': // 카드결제
  //       return {
  //         commission: Math.floor(targetAmount * (2.2 / 100)),
  //         rate: '2.2',
  //         description: '%',
  //       };
  //     case 'point': // 네이버페이 포인트
  //       return {
  //         commission: Math.floor(targetAmount * (3.74 / 100)),
  //         rate: '3.74',
  //         description: '%',
  //       };
  //     case 'cellphone': // 휴대폰 결제
  //       return {
  //         commission: Math.floor(targetAmount * (3.85 / 100)),
  //         rate: '3.85',
  //         description: '%',
  //       };
  //     default:
  //   }
  // }
  // switch (paymentMethod) {
  //   case 'account': // 계좌입금
  //     return {
  //       commission: Math.floor(targetAmount * (1.98 / 100)),
  //       rate: '1.98',
  //       description: '%',
  //     };
  //   case 'virtual': // 가상계좌 (고정수수료)
  //     return { commission: 330, rate: '330', description: '원 (고정)' };
  //   case 'cellphone': // 휴대폰결제
  //     return {
  //       commission: Math.floor(targetAmount * (3.85 / 100)),
  //       rate: '3.85',
  //       description: '%',
  //     };
  //   case 'bank': // 무통장입금
  //   default:
  //     return { commission: 0, rate: '0', description: '무료' };
  // }
  return { commission: 0, rate: '0', description: '무료' };
}
