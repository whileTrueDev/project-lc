import { Seller, SellerShop } from '@prisma/client';

export interface FindSellerRes extends Seller {
  shopName?: string;
}

export type AdminSellerListItem = Omit<Seller, 'password'> & {
  sellerShop: SellerShop;
};
export type AdminSellerListRes = AdminSellerListItem[];
