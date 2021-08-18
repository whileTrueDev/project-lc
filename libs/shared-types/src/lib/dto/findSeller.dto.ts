import { Seller } from '@prisma/client';
import { IsEmail } from 'class-validator';

export class FindSellerDto implements Partial<Seller> {
  @IsEmail()
  email: string;
}
