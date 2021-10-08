import {
  Goods,
  GoodsOptions,
  ShippingGroup,
  GoodsConfirmation,
  GoodsImages,
  GoodsInfo,
  GoodsOptionsSupplies,
  ShippingSet,
  ShippingOption,
  ShippingCost,
} from '@prisma/client';

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
};
