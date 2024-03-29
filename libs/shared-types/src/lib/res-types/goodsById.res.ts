import {
  Broadcaster,
  Goods,
  GoodsCategory,
  GoodsConfirmation,
  GoodsImages,
  GoodsInfo,
  GoodsInformationNotice,
  GoodsOptions,
  GoodsOptionsSupplies,
  LiveShopping,
  ProductPromotion,
  Seller,
  SellerShop,
  ShippingCost,
  ShippingGroup,
  ShippingOption,
  ShippingSet,
} from '@prisma/client';
import { PaginationResult } from '../core/paginationResult';

export interface GoodsInformationNoticeRes extends GoodsInformationNotice {
  contents: Record<string, string>;
}
export type GoodsRelatedBroadcaster = Pick<Broadcaster, 'id' | 'avatar' | 'userNickname'>;
export type GoodsByIdResBase = Goods & {
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
  informationNotice: GoodsInformationNoticeRes;
};

export type GoodsByIdSellerInfo = {
  seller: Pick<Seller, 'avatar' | 'id' | 'name' | 'email' | 'agreementFlag'> & {
    sellerShop?: {
      shopName: SellerShop['shopName'];
    };
  };
};
export type GoodsByIdRes = GoodsByIdResBase & GoodsByIdSellerInfo;

export type AdminGoodsByIdRes = GoodsByIdResBase & {
  seller: Seller;
};

/** 상품 개별 조회 반환 타입 (반환 데이터가 간략함) */
export interface GoodsOutlineByIdRes {
  id: Goods['id'];
  goods_name: Goods['goods_name'];
  summary: Goods['summary'];
  goods_status: Goods['goods_status'];
  options: GoodsByIdResBase['options'];
  image: GoodsImages[];
}
export type GoodsOutlineByIdPaginationRes = PaginationResult<GoodsOutlineByIdRes>;

export type AllGoodsIdsRes = { goods_name: Goods['goods_name']; id: Goods['id'] }[];
