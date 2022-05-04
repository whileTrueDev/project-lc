//* ------- 생성 dto -------

import {
  Customer,
  ExchangeProcessStatus,
  Export,
  Order,
  OrderItem,
  OrderItemOption,
  Seller,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/** 교환요청 이미지 생성dto */
export class CreateExchangeImageDto {
  /** 이미지 url 주소 */
  @IsString()
  imageUrl: string;
}

/** 교환상품 생성 dto */
export class CreateExchangeItemDto {
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

/** 교환 생성 dto */
export class CreateExchangeDto {
  /** 교환요청할 상품의 주문 고유번호 */
  @IsNumber()
  orderId: Order['id'];

  /** 교환사유 */
  @IsString()
  reason: string;

  /** 재배송시 받는곳 주소 도로명 */
  @IsString()
  @IsOptional()
  recipientAddress?: string;

  /** 재배송시 주소 주소 상세 */
  @IsString()
  @IsOptional()
  recipientDetailAddress?: string;

  /** 재배송시 주소 우편 번호 */
  @IsString()
  @IsOptional()
  recipientPostalCode?: string;

  /** 재배송시 배송메시지 */
  @IsString()
  @IsOptional()
  recipientShippingMemo?: string;

  /** 교환 상품들 */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateExchangeItemDto)
  exchangeItems: CreateExchangeItemDto[];

  /** 교환요청시 첨부한 이미지 */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExchangeImageDto)
  images?: CreateExchangeImageDto[];
}

//* ------- 조회 dto -------
/** 교환요청 내역 조회 dto */
export class GetExchangeListDto {
  /** 한 페이지에 몇개 표시할것인지 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  take?: number = 10; // take 값 없을때 기본값

  /** 몇개 건너뛰고 조회할것인지 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  skip?: number = 0;

  /** 특정 소비자의 교환요청 내역 조회시 사용 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  customerId?: Customer['id'];

  /** 특정 판매자가 판매중인 상품이 포함된 교환요청내역 조회시 사용 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sellerId?: Seller['id'];
}

//* -------- 수정 dto ----------
/** 교환 상태 변경 dto  */
export class UpdateExchangeDto {
  /** 교환처리상태  */
  @IsOptional()
  @IsEnum(ExchangeProcessStatus)
  status?: ExchangeProcessStatus;

  /** 교환요청 거절 사유 */
  @IsOptional()
  @IsString()
  rejectReason?: string;

  /** 책임소재(판매자귀책? 구매자귀책?) */
  @IsOptional()
  @IsString()
  responsibility?: string;

  /** 교환메모 */
  @IsOptional()
  @IsString()
  memo?: string;

  /** 재배송시 출고 고유번호 */
  @IsOptional()
  @IsNumber()
  exportId?: Export['id'];
}
