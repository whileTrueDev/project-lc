import {
  Order,
  OrderCancellation,
  OrderItem,
  OrderItemOption,
  Return,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

/** 환불상품생성 dto */
export class CreateRefundItemDto {
  /** 주문상품 고유번호 */
  @IsNumber()
  orderItemId: OrderItem['id'];

  /** 주문상품 옵션 고유번호 */
  @IsNumber()
  orderItemOptionId: OrderItemOption['id'];

  /** 개수 */
  @IsNumber()
  amount: number;
}

/** 환불정보생성 dto */
export class CreateRefundDto {
  /** 연결된 주문 고유번호 */
  @IsNumber()
  orderId: Order['id'];

  /** 환불사유 */
  @IsString()
  reason: string;

  /** 환불상품들 */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRefundItemDto)
  items: CreateRefundItemDto[];

  /** 연결된 주문취소 - 소비자가 입금한 주문에 대해 주문취소요청으로 환불 진행한 경우 */
  @IsNumber()
  @IsOptional()
  orderCancellationId?: OrderCancellation['id'];

  /** 연결된 반품 - 소비자의 환불요청(=수거없는 반품)에 대해  환불 진행한 경우 */
  @IsNumber()
  @IsOptional()
  returnId?: Return['id'];

  /** 책임소재 */
  @IsString()
  @IsOptional()
  responsibility?: string;

  /** 환불금액 */
  @IsNumber()
  refundAmount: number;

  /** 환불계좌번호 */
  @IsString()
  @IsOptional()
  refundAccount?: string;

  /** 환불계좌예금주명 */
  @IsString()
  @IsOptional()
  refundAccountHolder?: string;

  /** 환불은행 */
  @IsString()
  @IsOptional()
  refundBank?: string;

  /** 토스페이먼츠 결제취소 사용시 - 결제건에 대한 고유키(OrderPayment에서 지불했을 때 저장되는 paymentKey와 동일) */
  @IsString()
  @IsOptional()
  paymentKey?: string;

  /** 토스페이먼츠 결제취소 사용시 - 취소 거래건에 대한 고유키. (동일 paymentKey 가지는)결제건에 대해 승인거래와 취소거래 구분  */
  @IsString()
  @IsOptional()
  transactionKey?: string;
}
