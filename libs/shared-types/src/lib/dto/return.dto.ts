//* ------- 생성 dto

import { Order, OrderItem, OrderItemOption } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/** 반품요청 이미지 생성dto */
export class CreateReturnImageDto {
  /** 이미지 url 주소 */
  @IsString()
  imageUrl: string;
}

/** 반품상품 생성 dto */
export class CreateReturnItemDto {
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

/** 반품 생성 dto */
export class CreateReturnDto {
  /** 반품요청할 상품의 주문 고유번호 */
  @IsNumber()
  orderId: Order['id'];

  /** 반품사유 */
  @IsString()
  reason: string;

  /** 회수지 주소 */
  @IsString()
  @IsOptional()
  returnAddress?: string;

  /** 환불받을 은행 */
  @IsString()
  @IsOptional()
  returnBank?: string;

  /** 환불받을 은행계좌 */
  @IsString()
  @IsOptional()
  returnBankAccount?: string;

  /** 반품 상품들 */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  items: CreateReturnItemDto[];

  /** 반품요청시 첨부한 이미지 */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnImageDto)
  images?: CreateReturnImageDto[];
}
/** 반품요청 내역 조회 dto */
/** 특정 반품요청 상세 조회 dto */
/** 반품요청 상태 변경 dto */
/** 반품요청 삭제 dto */
