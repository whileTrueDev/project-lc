import {
  CartItem,
  CartItemOption,
  CartItemSupport,
  Goods,
  SellerShop,
  // ShippingCost,
  // ShippingGroup,
  // ShippingOption,
  // ShippingSet,
} from '@prisma/client';

export type CartItemRes = Array<
  CartItem & { options: CartItemOption[] } & { support: CartItemSupport } & {
    // 장바구니에서 ShippingGroup 에 대한 정보 필요시 주석 제거하여 사용할 수 있을 것.
    // shippingGroup: ShippingGroup & {
    //   shippingSets: Array<
    //     ShippingSet & {
    //       shippingOptions: Array<ShippingOption & { shippingCost: Array<ShippingCost> }>;
    //     }
    //   >;
    // };
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
