import {
  Broadcaster,
  CartItem,
  CartItemOption,
  CartItemSupport,
  Goods,
  GoodsImages,
  LiveShoppingSpecialPrice,
  SellerShop,
  ShippingCost,
  ShippingGroup,
  ShippingOption,
  ShippingSet,
  LiveShopping,
} from '@prisma/client';

export type CartItemRes = Array<
  CartItem & { options: CartItemOption[] } & {
    support:
      | (CartItemSupport & {
          broadcaster: Pick<Broadcaster, 'userNickname' | 'avatar'>;
          liveShopping: {
            progress: LiveShopping['progress'];
            broadcastStartDate: LiveShopping['broadcastStartDate'];
            broadcastEndDate: LiveShopping['broadcastEndDate'];
            sellStartDate: LiveShopping['sellStartDate'];
            sellEndDate: LiveShopping['sellEndDate'];
            liveShoppingSpecialPrices: LiveShoppingSpecialPrice[];
          };
        })
      | null;
  } & {
    // 장바구니에서 ShippingGroup 에 대한 정보 필요시 주석 제거하여 사용할 수 있을 것.
    shippingGroup: ShippingGroup & {
      shippingSets: Array<
        ShippingSet & {
          shippingOptions: Array<ShippingOption & { shippingCost: Array<ShippingCost> }>;
        }
      >;
    };
  } & {
    goods: {
      id: Goods['id'];
      image: GoodsImages[];
      goods_name: Goods['goods_name'];
      max_purchase_ea: Goods['max_purchase_ea'];
      max_purchase_limit: Goods['max_purchase_limit'];
      min_purchase_ea: Goods['min_purchase_ea'];
      min_purchase_limit: Goods['min_purchase_limit'];
      seller: {
        sellerShop: {
          shopName: SellerShop['shopName'];
        };
      };
    };
  }
>;
