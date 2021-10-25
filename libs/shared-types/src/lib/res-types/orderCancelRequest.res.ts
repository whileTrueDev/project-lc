import {
  SellerOrderCancelRequest,
  SellerOrderCancelRequestItem,
  Seller,
  SellerShop,
} from '@prisma/client';

export type OrderCancelRequestListItem = Pick<
  SellerOrderCancelRequest,
  'id' | 'reason' | 'orderSeq' | 'createDate'
> & {
  seller: Pick<Seller, 'email' | 'id'>;
};

export type OrderCancelRequestList = OrderCancelRequestListItem[];

export type OrderCancelRequestDetailRes = Omit<SellerOrderCancelRequest, 'sellerId'> & {
  seller: Pick<Seller, 'email' | 'id'> & { sellerShop: SellerShop };
  orderCancelItems: SellerOrderCancelRequestItem[];
};
