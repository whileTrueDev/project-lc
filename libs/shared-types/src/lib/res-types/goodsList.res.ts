import {
  Goods,
  GoodsConfirmationStatuses,
  GoodsOptions,
  GoodsOptionsSupplies,
  YesOrNo,
  YesOrNo_UPPERCASE,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

export type GoodsOptionsWithSupplies = GoodsOptions & {
  supply: GoodsOptionsSupplies[];
};

export type GoodsOptionWithStockInfo = {
  id: number;
  default_option: YesOrNo;
  option_title: string;
  consumer_price: Decimal;
  price: Decimal;
  option_view: YesOrNo_UPPERCASE;
  stock: number;
  badstock: number;
  rstock: number;
};

export type TotalStockInfo = {
  rstock: number; // 해당 상품의 전체 가용 재고
  a_stock_count: number; // 가용재고 1개 이상인 옵션 개수
  b_stock_count: number; // 가용재고 0개 이하인 옵션 개수
  a_rstock: number; // 가용재고 1개 이상인 옵션의 가용재고
  b_rstock: number; // 가용재고 0개 이하인 옵션의 가용재고
  a_stock: number; // 가용재고 1개 이상인 옵션의 재고
  b_stock: number; // 가용재고 0개 이하인 옵션의 재고
};

export type SellerGoodsListItem = Pick<
  Goods,
  | 'id'
  | 'sellerId'
  | 'goods_name'
  | 'runout_policy'
  | 'shipping_policy'
  | 'regist_date'
  | 'update_date'
  | 'goods_view'
> &
  TotalStockInfo & {
    confirmation?: null | GoodsConfirmationStatuses;
  };

export type GoodsListRes = {
  items: SellerGoodsListItem[];
  totalItemCount: number;
  maxPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
};
