import { CustomerCoupon, Coupon, Customer, CustomerCouponLog } from '@prisma/client';

type CustomerCouponCustomer = Pick<Customer, 'nickname' | 'email'>;

export interface CustomerCouponRes extends CustomerCoupon {
  customer: CustomerCouponCustomer;
  coupon: Coupon & { goods: { id: number }[] }; // 쿠폰적용가능 혹은 쿠폰적용불가 상품 id[]
}

export interface CustomerCouponLogRes extends CustomerCouponLog {
  customerCoupon: {
    coupon: {
      name: string;
    };
  };
}
