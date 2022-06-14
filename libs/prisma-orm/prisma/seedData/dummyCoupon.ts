import { Coupon, CustomerCoupon, CustomerCouponLog } from '@prisma/client';

export const dummyCoupon: Coupon = {
  id: 1,
  amount: 3000,
  unit: 'W',
  name: '테스트쿠폰',
  startDate: new Date(),
  maxDiscountAmountWon: null,
  minOrderAmountWon: 5000,
  endDate: null,
  applyField: 'goods',
  applyType: 'allGoods',
  createDate: new Date(),
  memo: null,
  concurrentFlag: false,
};

export const dummyCustomerCoupon: CustomerCoupon = {
  id: 1,
  couponId: 1,
  customerId: 1,
  issueDate: new Date(),
  status: 'notUsed',
};

export const dummyCustomerCouponLog: CustomerCouponLog = {
  id: 1,
  customerCouponId: 1,
  type: 'issue',
  createDate: new Date(),
  orderId: null,
};
