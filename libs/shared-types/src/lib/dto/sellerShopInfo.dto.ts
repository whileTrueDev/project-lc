import { SellerShop } from '@prisma/client';
import { IsString } from 'class-validator';

export class SellerShopInfoDto implements Partial<SellerShop> {
  @IsString() shopName?: string;
}
