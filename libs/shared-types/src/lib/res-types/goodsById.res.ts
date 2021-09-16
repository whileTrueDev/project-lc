import {
  Goods,
  GoodsOptions,
  ShippingGroup,
  GoodsConfirmation,
  Seller,
  GoodsImages,
  GoodsInfo,
  GoodsOptionsSupplies,
} from '@prisma/client';

export type GoodsByIdRes = Goods & {
  options: (GoodsOptions & {
    supply: GoodsOptionsSupplies[];
  })[];
  ShippingGroup: ShippingGroup | null;
  confirmation: GoodsConfirmation | null;
  seller: Seller;
  image: GoodsImages[];
  GoodsInfo: GoodsInfo | null;
};
