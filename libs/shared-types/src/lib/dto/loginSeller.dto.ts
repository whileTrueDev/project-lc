import { Seller } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class LoginSellerDto implements Partial<Seller> {
  @IsEmail() email: string;

  @IsString() password: string;
}
