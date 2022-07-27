import { IsString, IsNumber, ValidateNested } from 'class-validator';

export class SellerOrderCancelRequestDto {
  @IsString()
  orderSeq: string;

  @IsString()
  reason: string;

  @ValidateNested({ each: true })
  orderCancelItems: SellerOrderCancelRequestItemDto[];
}

export class SellerOrderCancelRequestItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  orderItemSeq: number;

  @IsNumber()
  orderItemOptionSeq: number;
}
