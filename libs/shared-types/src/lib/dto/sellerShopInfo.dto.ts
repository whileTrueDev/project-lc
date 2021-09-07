import { Seller } from '@prisma/client';
import { IsString } from 'class-validator';

export class SellerShopInfoDto implements Partial<Seller> {
  @IsString() shopName: string;
}
