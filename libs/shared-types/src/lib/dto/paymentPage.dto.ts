import { IsNumber, IsString, IsOptional } from 'class-validator';

export class PaymentPageDto {
  @IsNumber()
  customerId: number;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  orderPhone: string;

  @IsOptional()
  @IsString()
  orderPhone1?: string;

  @IsOptional()
  @IsString()
  orderPhone2?: string;

  @IsOptional()
  @IsString()
  orderPhone3?: string;

  @IsString()
  recipient: string;

  @IsString()
  recipientPhone: string;

  @IsString()
  recipientPhone1: string;

  @IsString()
  recipientPhone2: string;

  @IsString()
  recipientPhone3: string;

  @IsString()
  postalCode: string;

  @IsString()
  address: string;

  @IsString()
  detailAddress: string;

  @IsNumber()
  goods_id: number;

  @IsNumber()
  optionId: number;

  @IsNumber()
  number: number;

  @IsNumber()
  shipping_cost: number;

  @IsNumber()
  mileage: number;

  @IsNumber()
  couponId: number;

  @IsNumber()
  couponAmount: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  orderPrice: number;

  @IsNumber()
  paymentPrice: number;
}
