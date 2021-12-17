import { Seller, SellerShop } from '@prisma/client';

export interface FindSellerRes extends Seller {
  shopName?: string;
}

export type AdminSellerListRes = (Omit<Seller, 'password'> & {
  sellerShop: SellerShop;
})[];
