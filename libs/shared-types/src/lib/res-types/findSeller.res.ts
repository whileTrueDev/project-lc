import { Seller, SellerShop } from '@prisma/client';

export interface FindSellerRes extends Seller {
  shopName?: string;
}

export type AdminSellerListItem = Omit<Seller, 'password' | 'agreementFlag'> & {
  sellerShop: SellerShop;
};
export type AdminSellerListRes = AdminSellerListItem[];

export type SellerAgreementFlag = Pick<Seller, 'agreementFlag'>;
