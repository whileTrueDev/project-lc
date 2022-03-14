import {
  Goods,
  GoodsConfirmation,
  GoodsOptions,
  GoodsOptionsSupplies,
  GoodsStatus,
  ShippingGroup,
  YesOrNo,
  YesOrNo_UPPERCASE,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

export type GoodsOptionsWithSupplies = GoodsOptions & {
  supply: GoodsOptionsSupplies;
};

export type GoodsOptionWithStockInfo = {
  id: number;
  default_option: YesOrNo;
  option_title?: string;
  option1?: string;
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

export type GoodsDefaultData = Pick<
Goods,
| 'id'
| 'sellerId'
| 'goods_name'
| 'runout_policy'
| 'shipping_policy'
| 'regist_date'
| 'update_date'
| 'goods_view'
>& { default_price: Decimal; // 판매가(할인가) - GoodsOptions중 default_option의 판매가
 default_consumer_price: Decimal; // 소비자가(미할인가) - GoodsOptions중 default_option의 소비자가} 
 shippingGroup?: Pick<ShippingGroup, 'id' | 'shipping_group_name'>;
}

export type SellerGoodsListItem = GoodsDefaultData &
  TotalStockInfo & {
    confirmation?: GoodsConfirmation;
   
    businessRegistrationStatus?: string;
    onLiveShopping?: boolean;
  };

export type GoodsListRes = {
  items: SellerGoodsListItem[];
  totalItemCount: number;
  maxPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
};

export type ApprovedGoodsNameAndId = {
  firstmallGoodsConnectionId: number;
  goods_name: string;
};





// GET /admin/goods 관리자 페이지 상품검수목록 리턴타입
export type AdminGoodsListRes = {
  items: AdminGoodsData[],
  totalItemCount: number,
}

export type AdminGoodsData = GoodsDefaultData & {
  goods_status: GoodsStatus,
  confirmation: GoodsConfirmation,
  name: string, // 판매자명
  agreementFlag: boolean, // 판매자 약관동의여부
  businessRegistrationStatus: string, // 사업자등록정보검수상태
}