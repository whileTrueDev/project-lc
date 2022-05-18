import { Customer, ProcessStatus, Seller } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

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
  @IsOptional()
  @IsString()
  reason?: string;

  /** 책임소재 */
  @IsString()
  @IsOptional()
  responsibility?: string;

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
  skip?: number = 0;

  /** 목록조회시 조회 할 데이터 개수 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  take?: number = 5;

  /** 특정 소비자의 주문취소내역 조회시 소비자 고유번호 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  customerId?: Customer['id'];

  /** 특정 판매자의 판매상품이 포함된 주문취소내역 조회시 판매자 고유번호 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sellerId?: Seller['id'];
}

// *------------ 주문취소 상태변경 dto ------------------
export class UpdateOrderCancellationStatusDto {
  /** 변경될 처리상태 */
  @IsEnum(ProcessStatus)
  @IsOptional()
  status?: ProcessStatus;

  /* 거절시 거절사유 입력필요 */
  @ValidateIf((o) => o.status === ProcessStatus.canceled)
  @IsString()
  rejectReason?: string;

  /** 주문취소요청에 대한 환불 완료시 환불고유번호 입력 */
  @IsNumber()
  @IsOptional()
  refundId?: number;

  /** 책임소재 */
  @IsString()
  @IsOptional()
  responsibility?: string;
}

/** 주문취소 상세조회 파라미터 */
export class FindOrderCancelParams {
  @IsString()
  cancelCode: string;
}
