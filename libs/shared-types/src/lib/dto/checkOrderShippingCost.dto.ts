import { OrderItem, OrderItemOption } from '@prisma/client';
import { Type, plainToClass, Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  ValidateIf,
  ValidateNested,
  IsArray,
} from 'class-validator';

export class ShippingCheckItem {
  /** 연결된 상품 고유번호 */
  @IsNumber()
  @Type(() => Number)
  goodsId: OrderItem['goodsId'];

  /** 참조하는 상품옵션 고유번호 */
  @IsNumber()
  @Type(() => Number)
  goodsOptionId: OrderItemOption['goodsOptionId'];

  /**  옵션 선택 수량(개수) */
  @IsNumber()
  @Type(() => Number)
  quantity: OrderItemOption['quantity'];
}
/** 배송비 조회 위해 필요한 데이터
 * 1. 주소(선물주문이 아닌경우) | 방송인id(선물주문인 경우),
 * 2. 주문상품, 주문상품옵션, 주문상품개수
 * */
export class OrderShippingCheckDto {
  /** 선물주문인지 여부 */
  @IsBoolean()
  @Type(() => Boolean)
  isGiftOrder: boolean;

  /** 주소 - 선물주문이 "아닌" 경우 필요함 */
  @ValidateIf((o) => !o.isGiftOrder)
  @IsOptional()
  @IsString()
  address?: string;

  /** 우편번호 - 선물주문이 "아닌" 경우 필요함 */
  @ValidateIf((o) => !o.isGiftOrder)
  @IsOptional()
  @IsString()
  postalCode?: string;

  /** 선물받을 방송인 고유번호 broadcaster.id - 선물주문인 경우 필요함 */
  @ValidateIf((o) => o.isGiftOrder)
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  broadcasterId?: number;

  /** 주문할 {goodsId, goodsOptionId, quantity 개수} 배열 */
  @Type(() => ShippingCheckItem)
  items: ShippingCheckItem[];
  // https://stackoverflow.com/questions/61557115/how-to-json-parse-a-key-before-validating-dto
}
