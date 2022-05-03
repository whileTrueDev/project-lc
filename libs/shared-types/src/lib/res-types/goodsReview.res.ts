import {
  Customer,
  GoodsReview,
  GoodsReviewComment,
  GoodsReviewImage,
  Seller,
  SellerShop,
} from '@prisma/client';

export type GoodsReviewItem = GoodsReview & {
  images: GoodsReviewImage[];
  writer: Pick<Customer, 'id' | 'name' | 'nickname' | 'gender'>;
};
export type GoodsReviewRes = {
  reviews: GoodsReviewItem[];
  nextCursor?: number;
};

export type GoodsReviewCommentItem = GoodsReviewComment & {
  customer: Pick<Customer, 'id' | 'name' | 'nickname' | 'gender'>;
  seller: Pick<Seller, 'id' | 'avatar'> & {
    sellerShop: {
      shopName: SellerShop['shopName'];
    };
  };
};
export type GoodsReviewCommentRes = GoodsReviewCommentItem[];
