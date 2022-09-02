import { OrderItemOption, OrderProcessStep } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

// ------------------생성 dto--------------------

/** 주문상품옵션 OrderItemOption 생성 dto */
export class CreateOrderItemOptionDto {
  /**  주문했을 당시 옵션명 */
  @IsString()
  name: OrderItemOption['name'];

  /** 주문했을 당시 옵션값 */
  @IsString()
  value: OrderItemOption['value'];

  /**  옵션 선택 수량(개수) */
  @IsNumber()
  quantity: OrderItemOption['quantity'];

  /** 주문했을 당시 소비자가 (미할인가)  @db.Decimal(10, 2)  */
  @IsNumber()
  @Type(() => Number)
  normalPrice: number;

  /** 주문했을 당시 판매가 (할인가) @db.Decimal(10, 2)  */
  @IsNumber()
  @Type(() => Number)
  discountPrice: number;

  /** 주문했을 당시 옵션 개당 무게 (단위 kg) Float? */
  @IsNumber()
  @IsOptional()
  weight?: OrderItemOption['weight'];

  /** 참조하는 상품옵션 고유번호 */
  @IsNumber()
  goodsOptionId: OrderItemOption['goodsOptionId'];

  /** 라이브쇼핑 특가로 주문한 경우 라이브쇼핑 특가정보 */
  @IsOptional() @IsNumber() liveShoppingSpecialPriceId?: number;
}
// ------------------수정 dto--------------------
export class UpdateOrderItemOptionDto {
  @IsEnum(OrderProcessStep) step?: OrderProcessStep;
}
