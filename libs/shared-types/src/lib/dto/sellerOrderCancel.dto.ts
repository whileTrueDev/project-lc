import { IsString, IsNumber, ValidateNested } from 'class-validator';

export class SellerOrderCancelRequestDto {
  @IsString()
  orderSeq: string;

  @IsString()
  reason: string;

  @ValidateNested({ each: true })
  orderCancelItems: sellerOrderCancelRequestItemDto[];
}

export class sellerOrderCancelRequestItemDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  orderItemSeq: number;

  @IsNumber()
  orderItemOptionSeq: number;
}
