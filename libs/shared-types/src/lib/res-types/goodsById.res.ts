import {
  Goods,
  GoodsOptions,
  ShippingGroup,
  GoodsConfirmation,
  GoodsImages,
  GoodsInfo,
  GoodsOptionsSupplies,
} from '@prisma/client';

export type GoodsByIdRes = Goods & {
  options: (GoodsOptions & {
    supply: GoodsOptionsSupplies;
  })[];
  ShippingGroup: ShippingGroup | null;
  confirmation: GoodsConfirmation | null;
  image: GoodsImages[];
  GoodsInfo: GoodsInfo | null;
};
