import { Seller } from '@prisma/client';

export interface FindSellerRes extends Seller {
  shopName?: string;
}
