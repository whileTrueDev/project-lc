import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

/** 주문취소에 포함된 상품 dto */
export class OrderCancellationItemDto {
  /** 주문상품 고유번호 */
  @IsNumber()
  orderItemId: number;

  /** 주문상품 옵션 고유번호 */
  @IsNumber()
  orderItemOptionId: number;

  /** 주문상품 옵션 취소할 개수 */
  @IsNumber()
  amount: number;
}

/** 주문취소생성 dto */
export class CreateOrderCancellationDto {
  /** 취소할 주문 고유번호 */
  @IsNumber()
  orderId: number;

  /** 주문취소요청 사유 */
  @IsString()
  reason: string;

  /** 책임소재 */
  @IsString()
  responsibility: string;

  /** 취소할 주문상품옵션 목록 */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderCancellationItemDto)
  items: OrderCancellationItemDto[];
}
