import {
  Broadcaster,
  Goods,
  GoodsCategory,
  GoodsConfirmation,
  GoodsImages,
  GoodsInfo,
  GoodsInformationNotice,
  GoodsInformationSubject,
  GoodsOptions,
  GoodsOptionsSupplies,
  LiveShopping,
  ProductPromotion,
  Seller,
  ShippingCost,
  ShippingGroup,
  ShippingOption,
  ShippingSet,
} from '@prisma/client';

export type GoodsRelatedBroadcaster = Pick<Broadcaster, 'id' | 'avatar' | 'userNickname'>;
export type GoodsByIdRes = Goods & {
  options: (GoodsOptions & {
    supply: GoodsOptionsSupplies;
  })[];
  ShippingGroup:
    | (ShippingGroup & {
        shippingSets: Array<
          ShippingSet & {
            shippingOptions: Array<ShippingOption & { shippingCost: ShippingCost[] }>;
          }
        >;
      })
    | null;
  confirmation: GoodsConfirmation;
  image: GoodsImages[];
  GoodsInfo: GoodsInfo | null;
  LiveShopping?: Array<
    LiveShopping & {
      broadcaster: GoodsRelatedBroadcaster;
    }
  >;
  productPromotion: Array<
    ProductPromotion & {
      broadcaster: GoodsRelatedBroadcaster;
    }
  >;
  categories: GoodsCategory[];
  informationNotice: GoodsInformationNotice;
  informationSubject: GoodsInformationSubject;
};

export type AdminGoodsByIdRes = GoodsByIdRes & {
  seller: Seller;
};
