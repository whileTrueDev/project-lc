import { Seller } from '@prisma/client';

export type SellerPayload = Omit<Seller, 'password'>;

export interface UserPayload {
  email: string;
  password: string;
  type?: string;
}
