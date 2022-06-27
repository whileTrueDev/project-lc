import {
  Order,
  OrderShipping,
  PaymentMethod,
  Seller,
  SellerSettlementItems,
  SellerSettlements,
  SellType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SellerSettlementItemDto {
  @IsNumber() relatedOrderId: number;
  @IsNumber() itemId: SellerSettlementItems['itemId'];
  @IsString() goods_name: SellerSettlementItems['goods_name'];
  @IsString() goods_image: SellerSettlementItems['goods_image'];
  @IsString() option_title: SellerSettlementItems['option_title'];
  @IsString() option1: SellerSettlementItems['option1'];
  @IsNumber() optionId: SellerSettlementItems['optionId'];
  @IsNumber() ea: SellerSettlementItems['ea'];
  @IsNumber() price: SellerSettlementItems['price'];
  @IsNumber() pricePerPiece: SellerSettlementItems['pricePerPiece'];
  @IsOptional() @IsNumber() liveShoppingId?: SellerSettlementItems['liveShoppingId'];

  @IsOptional()
  @IsNumber()
  productPromotionId?: SellerSettlementItems['productPromotionId'];

  @IsEnum(SellType) sellType: SellType;
  @IsOptional() @IsString() whiletrueCommissionRate: string | null;
  @IsOptional() @IsString() broadcasterCommissionRate: string | null;
  @IsOptional() @IsNumber() whiletrueCommission: number | null;
  @IsOptional() @IsNumber() broadcasterCommission: number | null;
}

export class ExecuteSettlementDto {
  @IsNumber() sellerId: Seller['id'];
  @IsString() @IsIn(['1', '2']) round: '1' | '2';

  @IsNumber() exportId: SellerSettlements['exportId'];
  @IsString() exportCode: SellerSettlements['exportCode'];
  @IsNumber() orderId: Order['id'];
  @IsDateString() startDate: SellerSettlements['startDate'];
  @IsDateString() doneDate: SellerSettlements['doneDate'];
  @IsString() buyer: SellerSettlements['buyer'];
  @IsString() recipient: SellerSettlements['recipient'];
  @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;
  @IsOptional() @IsString() pg?: SellerSettlements['pg'];
  @IsOptional() @IsNumber() pgCommission?: SellerSettlements['pgCommission'];
  @IsOptional() @IsString() pgCommissionRate?: SellerSettlements['pgCommissionRate'];

  @Type(() => SellerSettlementItemDto)
  @IsArray()
  items: SellerSettlementItemDto[];
}
