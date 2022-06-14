import { CustomerCoupon, Coupon, Customer, CustomerCouponLog } from '@prisma/client';

type CustomerCouponCustomer = Pick<Customer, 'nickname' | 'email'>;

export interface CustomerCouponRes extends CustomerCoupon {
  customer: CustomerCouponCustomer;
  coupon: Coupon;
}

export interface CustomerCouponLogRes extends CustomerCouponLog {
  customerCoupon: {
    coupon: {
      name: string;
    };
  };
}
