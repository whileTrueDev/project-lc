import { Seller } from '@prisma/client';
import { IsString } from 'class-validator';

export class SellerStoreInfoDto implements Partial<Seller> {
  @IsString() storeName: string;
}
