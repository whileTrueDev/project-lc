import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

// *------------ 주문취소 생성 dto ------------------
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

// *------------ 주문취소 목록조회 dto ------------------
/** 주문취소 목록조회 dto */
export class GetOrderCancellationListDto {
  /** 목록조회시 skip할 데이터 개수 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  skip?: number;

  /** 목록조회시 조회 할 데이터 개수 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  take?: number = 5;

  /** 특정 소비자의 주문취소내역 조회시 소비자 고유번호 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  customerId?: number;

  /** 특정 판매자의 판매상품이 포함된 주문취소내역 조회시 판매자 고유번호 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sellerId?: number;
}
