import { SellType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

/** 주문상품후원 OrderItemSupport 생성 dto */
export class CreateOrderItemSupportDto {
  @IsString()
  @IsOptional()
  /** 후원메시지 */
  message?: string;

  @IsString()
  @IsOptional()
  /** 후원한 사람 닉네임(로그인한 경우 로그인한 사람의 닉네임, 비로그인은 '') */
  nickname?: string;

  @IsInt()
  /** 후원 대상 방송인 고유번호 */
  broadcasterId: number;
}

/** 주문상품옵션 OrderItemOption 생성 dto */
export class CreateOrderItemOptionDto {
  /**  주문했을 당시 옵션명 */
  @IsString()
  name: string;

  /** 주문했을 당시 옵션값 */
  @IsString()
  value: string;

  /**  옵션 선택 수량(개수) */
  @IsNumber()
  quantity: number;

  /** 주문했을 당시 소비자가 (미할인가)  @db.Decimal(10, 2)  */
  @IsNumber()
  normalPrice: number;

  /** 주문했을 당시 판매가 (할인가) @db.Decimal(10, 2)  */
  @IsNumber()
  discountPrice: number;

  /** 주문했을 당시 옵션 개당 무게 (단위 kg) Float? */
  @IsNumber()
  @IsOptional()
  weight?: number;
}

/** 주문상품 OrderItem 생성 dto */
export class CreateOrderItemDto {
  /** 연결된 상품 고유번호 */
  @IsInt()
  goodsId: number;

  /** 판매유형(주문경로) @default(normal) */
  @IsEnum(SellType)
  @IsOptional()
  channel?: SellType;

  /** 주문상품 옵션들[] */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  options: CreateOrderItemOptionDto[];

  /** 주문상품에 연결된 후원정보 */
  @IsOptional()
  @Type(() => CreateOrderItemSupportDto)
  support?: CreateOrderItemSupportDto;

  /** 주문당시 이 주문 상품에 포함된  배송비 Decimal @default("0.00") @db.Decimal(10, 2)  */
  @IsNumber()
  shippingCost: number;

  /**  이 주문 상품에 동일 판매자의 배송비가 포함되었는지 여부 @default(false)  */
  @IsBoolean()
  @IsOptional()
  shippingCostIncluded?: boolean;

  /**  연결된 배송정책 id */
  @IsInt()
  shippingGroupId: number;
}

/** 주문 Order 생성 dto */
export class CreateOrderDto {
  /** 소비자 고유번호(비회원 주문인경우 undefined) */
  @ValidateIf((o) => !o.nonMemberOrderFlag)
  @IsInt()
  @IsOptional()
  customerId?: number;

  /** 비회원 주문인 경우 true로 보냄. @default(false) */
  @IsBoolean()
  @IsOptional()
  nonMemberOrderFlag?: boolean;

  /** 비회원 주문인 경우 입력받는 비밀번호 - 비회원이 주문조회, 취소시 사용할예정 */
  @IsString()
  @IsOptional()
  nonMemberOrderPassword?: string;

  /** 주문금액 = 실제 주문 상품/상품옵션 의 금액 합 */
  @IsNumber()
  orderPrice: number;

  /** 결제금액 = 할인(쿠폰;할인코드;마일리지 적용)이후 사용자가 실제 결제한 금액 */
  @IsNumber()
  paymentPrice: number;

  // ---------------- 선물하기가 아닌경우 validation, 선물하기인 경우 서비스함수에서 후원방송인 정보로 저장함
  /** 받는사람명 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientName: string;

  /** 받는사람 연락처 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientPhone: string;

  /** 받는사람 이메일 */
  @ValidateIf((o) => !o.giftFlag)
  @IsEmail()
  recipientEmail: string;

  /** 받는사람 주소(배송지) 도로명 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientAddress: string;

  /** 받는사람 주소(배송지) 주소 상세 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientDetailAddress: string;

  /** 받는사람 주소(배송지) 우편 번호 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientPostalCode: string;
  // ---------------- 선물하기가 아닌경우 validation, 선물하기인 경우 서비스함수에서 후원방송인 정보로 저장함

  /** 주문자명 */
  @IsString()
  ordererName: string;

  /** 주문자 연락처 */
  @IsString()
  ordererPhone: string;

  /** 주문자 이메일 */
  @IsEmail()
  ordererEmail: string;

  /** 배송메시지 */
  @IsString()
  memo: string;

  /** 선물주문 여부/ @default(false) */
  @IsBoolean()
  @IsOptional()
  giftFlag?: boolean;

  /** 후원상품 포함여부 @default(false) */
  @IsBoolean()
  @IsOptional()
  supportOrderIncludeFlag?: boolean;

  /** 묶음배송여부 @default(false) */
  @IsBoolean()
  @IsOptional()
  bundleFlag?: boolean;

  /** String? // 현금영수증번호 */
  @IsString()
  @IsOptional()
  cashReceipts?: string;

  /** 주문에 연결된 주문상품들 */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
