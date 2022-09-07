import {
  CustomerCoupon,
  Coupon,
  Customer,
  CustomerCouponLog,
  Goods,
  GoodsImages,
} from '@prisma/client';

type CustomerCouponCustomer = Pick<Customer, 'nickname' | 'email'>;

export interface CustomerCouponRes extends CustomerCoupon {
  customer: CustomerCouponCustomer;
  coupon: Coupon & {
    goods: {
      id: Goods['id']; // 쿠폰적용가능 혹은 쿠폰적용불가 상품 id
      goods_name: Goods['goods_name'];
      image: GoodsImages[]; // 연결된 상품 이미지 중 take 1
    }[];
  };
}

export interface CustomerCouponLogRes extends CustomerCouponLog {
  customerCoupon: {
    coupon: {
      name: string;
    };
  };
}
