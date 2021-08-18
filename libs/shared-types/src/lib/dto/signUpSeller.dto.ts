import { Seller } from '@prisma/client';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpSellerDto implements Partial<Seller> {
  @IsEmail() email: string;

  @IsString() name: string;

  @IsString() password: string;

  @IsString() @Length(6) code: string;
}
