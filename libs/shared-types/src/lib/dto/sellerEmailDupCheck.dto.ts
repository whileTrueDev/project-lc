import { IsEmail } from 'class-validator';

export class SellerEmailDupCheckDto {
  @IsEmail()
  email: string;
}
