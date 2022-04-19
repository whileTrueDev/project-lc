import {
  CartItem,
  CartItemOption,
  CartItemSupport,
  Goods,
  SellerShop,
  ShippingGroup,
} from '@prisma/client';

export type CartItemRes = Array<
  CartItem & { options: CartItemOption[] } & { support: CartItemSupport } & {
    shippingGroup: ShippingGroup;
  } & {
    goods: {
      goods_name: Goods['goods_name'];
      seller: {
        sellerShop: {
          shopName: SellerShop['shopName'];
        };
      };
    };
  }
>;
