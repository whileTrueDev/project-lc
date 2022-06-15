import { IsNumber, IsString, IsOptional } from 'class-validator';

// TODO: 사용하지 않는경우 삭제(DeliveryAddress 등에서 사용되던 PaymentPageDto 를 CreateOrderForm 로 교체하였습니다)

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

  @IsOptional()
  @IsNumber()
  couponId?: number | null;

  @IsOptional()
  @IsNumber()
  couponAmount?: number | null;

  @IsNumber()
  discount: number;

  @IsNumber()
  orderPrice: number;

  @IsNumber()
  paymentPrice: number;

  @IsString()
  deliveryMemo: string;
}
