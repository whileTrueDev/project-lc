import {
  Customer,
  GoodsReview,
  GoodsReviewComment,
  GoodsReviewImage,
  Seller,
  SellerShop,
} from '@prisma/client';

export type GoodsReviewItem = GoodsReview & { images: GoodsReviewImage[] };
export type GoodsReviewRes = GoodsReviewItem[];

export type GoodsReviewCommentItem = GoodsReviewComment & {
  customer: Pick<Customer, 'id' | 'name' | 'nickname' | 'gender'>;
  seller: Pick<Seller, 'id' | 'avatar'> & {
    sellerShop: {
      shopName: SellerShop['shopName'];
    };
  };
};
export type GoodsReviewCommentRes = GoodsReviewCommentItem[];
