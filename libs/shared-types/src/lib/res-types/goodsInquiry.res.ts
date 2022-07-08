import {
  Administrator,
  Customer,
  GoodsInquiry,
  GoodsInquiryComment,
  Seller,
  SellerShop,
} from '@prisma/client';

export type FindGoodsInquiryItem = GoodsInquiry & {
  writer: Pick<Customer, 'id' | 'name' | 'nickname' | 'email'>;
};
export type FindGoodsInquiryRes = Array<FindGoodsInquiryItem>;
export type PaginatedGoodsInquiryRes = {
  goodsInquiries: Array<FindGoodsInquiryItem>;
  nextCursor?: number;
};

export type GoodsInquiryCommentResItem = GoodsInquiryComment & {
  seller:
    | (Pick<Seller, 'id' | 'avatar'> & {
        sellerShop: Pick<SellerShop, 'shopName'> | null;
      })
    | null;
  admin: Pick<Administrator, 'id' | 'email'> | null;
};
export type GoodsInquiryCommentRes = GoodsInquiryCommentResItem[];
