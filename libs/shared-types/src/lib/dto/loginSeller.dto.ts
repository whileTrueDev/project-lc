import { Seller } from '@prisma/client';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class LoginSellerDto implements Partial<Seller> {
  @IsEmail() email: string;

  @IsString() password: string;

  @IsBoolean() stayLogedIn?: boolean;
}
