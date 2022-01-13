import { LiveShopping } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { checkOrderDuringLiveShopping } from './checkOrderDuringLiveShopping';

const startDate = new Date('2021-10-21 17:29:00');
const endDate = new Date('2021-10-21 17:30:00');

const liveShopping: LiveShopping = {
  id: 1,
  contactId: 1,
  sellerId: 1,
  goodsId: 1,
  broadcasterId: 1,
  whiletrueCommissionRate: new Decimal('5'),
  broadcasterCommissionRate: new Decimal('10'),
  createDate: new Date('2021-10-21 17:29:00'),
  progress: 'confirmed',
  broadcastStartDate: startDate,
  broadcastEndDate: endDate,
  sellStartDate: startDate,
  sellEndDate: endDate,
  rejectionReason: null,
  requests: null,
  videoId: null,
  fmGoodsSeq: 1,
  desiredCommission: new Decimal('30'),
  desiredPeriod: '무관',
  liveShoppingName: '',
};

describe('checkOrderDuringLiveShopping', () => {
  test('라이브쇼핑 판매시간 내에 구매한 주문의 경우, true를 반환', () => {
    const orderDate = new Date('2021-10-21 17:29:59');

    const result = checkOrderDuringLiveShopping({ order_date: orderDate }, liveShopping);
    expect(result).toBeTruthy();
  });

  test('라이브쇼핑 판매시간 시작시간에 구매한 주문의 경우, false를 반환', () => {
    const orderDate = new Date('2021-10-21 17:29:00');

    const result = checkOrderDuringLiveShopping({ order_date: orderDate }, liveShopping);
    expect(result).toBeFalsy();
  });

  test('라이브쇼핑 판매시간 마감시간에 구매한 주문의 경우, false를 반환', () => {
    const orderDate = new Date('2021-10-21 17:30:00');

    const result = checkOrderDuringLiveShopping({ order_date: orderDate }, liveShopping);
    expect(result).toBeFalsy();
  });

  test('라이브쇼핑 판매시간 이외에 구매한 주문의 경우, false를 반환', () => {
    const orderDate = new Date('2021-10-21 17:30:01');

    const result = checkOrderDuringLiveShopping({ order_date: orderDate }, liveShopping);
    expect(result).toBeFalsy();
  });
});
