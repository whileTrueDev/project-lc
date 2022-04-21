import {
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemSupport,
  OrderPayment,
  SellType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
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
  message?: OrderItemSupport['message'];

  @IsString()
  @IsOptional()
  /** 후원한 사람 닉네임(로그인한 경우 로그인한 사람의 닉네임, 비로그인은 '') */
  nickname?: OrderItemSupport['nickname'];

  @IsNumber()
  /** 후원 대상 방송인 고유번호 */
  broadcasterId: OrderItemSupport['broadcasterId'];
}

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
  normalPrice: OrderItemOption['normalPrice'];

  /** 주문했을 당시 판매가 (할인가) @db.Decimal(10, 2)  */
  @IsNumber()
  discountPrice: OrderItemOption['discountPrice'];

  /** 주문했을 당시 옵션 개당 무게 (단위 kg) Float? */
  @IsNumber()
  @IsOptional()
  weight?: OrderItemOption['weight'];

  /** 참조하는 상품옵션 고유번호 */
  @IsNumber()
  goodsOptionId: OrderItemOption['goodsOptionId'];
}

/** 주문상품 OrderItem 생성 dto */
export class CreateOrderItemDto {
  /** 연결된 상품 고유번호 */
  @IsNumber()
  goodsId: OrderItem['goodsId'];

  /** 판매유형(주문경로) @default(normal) */
  @IsEnum(SellType)
  @IsOptional()
  channel?: OrderItem['channel'];

  /** 주문상품 옵션들[] */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemOptionDto)
  options: CreateOrderItemOptionDto[];

  /** 주문상품에 연결된 후원정보 */
  @IsOptional()
  @Type(() => CreateOrderItemSupportDto)
  support?: CreateOrderItemSupportDto;

  /** 주문당시 이 주문 상품에 포함된  배송비 Decimal @default("0.00") @db.Decimal(10, 2)  */
  @IsNumber()
  shippingCost: OrderItem['shippingCost'];

  /**  이 주문 상품에 동일 판매자의 배송비가 포함되었는지 여부 @default(false)  */
  @IsBoolean()
  @IsOptional()
  shippingCostIncluded?: OrderItem['shippingCostIncluded'];

  /**  연결된 배송정책 id */
  @IsNumber()
  shippingGroupId: OrderItem['shippingGroupId'];
}

/** 주문 Order 생성 dto */
export class CreateOrderDto {
  /** 소비자 고유번호(비회원 주문인경우 validate 안함) */
  @ValidateIf((o) => !o.nonMemberOrderFlag)
  @IsNumber()
  customerId?: Order['customerId'];

  /** 비회원 주문인 경우 true로 보냄. @default(false) */
  @IsBoolean()
  @IsOptional()
  nonMemberOrderFlag?: Order['nonMemberOrderFlag'];

  /** 비회원 주문인 경우 입력받는 비밀번호 - 비회원이 주문조회, 취소시 사용할예정, 비회원주문인경우에만 validate */
  @ValidateIf((o) => o.nonMemberOrderFlag)
  @IsString()
  nonMemberOrderPassword?: Order['nonMemberOrderPassword'];

  /** 주문금액 = 실제 주문 상품/상품옵션 의 금액 합 */
  @IsNumber()
  orderPrice: Order['orderPrice'];

  /** 결제금액 = 할인(쿠폰,할인코드,마일리지 적용)이후 사용자가 실제 결제한 금액 */
  @IsNumber()
  paymentPrice: Order['paymentPrice'];

  // ---------------- 선물하기가 아닌경우 validation, 선물하기인 경우 서비스함수에서 후원방송인 정보로 저장함
  /** 받는사람명 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientName: Order['recipientName'];

  /** 받는사람 연락처 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientPhone: Order['recipientPhone'];

  /** 받는사람 이메일 */
  @ValidateIf((o) => !o.giftFlag)
  @IsEmail()
  recipientEmail: Order['recipientEmail'];

  /** 받는사람 주소(배송지) 도로명 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientAddress: Order['recipientAddress'];

  /** 받는사람 주소(배송지) 주소 상세 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientDetailAddress: Order['recipientDetailAddress'];

  /** 받는사람 주소(배송지) 우편 번호 */
  @ValidateIf((o) => !o.giftFlag)
  @IsString()
  recipientPostalCode: Order['recipientPostalCode'];
  // ---------------- 선물하기가 아닌경우 validation, 선물하기인 경우 서비스함수에서 후원방송인 정보로 저장함

  /** 주문자명 */
  @IsString()
  ordererName: Order['ordererName'];

  /** 주문자 연락처 */
  @IsString()
  ordererPhone: Order['ordererPhone'];

  /** 주문자 이메일 */
  @IsEmail()
  ordererEmail: Order['ordererEmail'];

  /** 배송메시지 */
  @IsString()
  memo: Order['memo'];

  /** 선물주문 여부/ @default(false) */
  @IsBoolean()
  @IsOptional()
  giftFlag?: Order['giftFlag'];

  /** 후원상품 포함여부 @default(false) */
  @IsBoolean()
  @IsOptional()
  supportOrderIncludeFlag?: Order['supportOrderIncludeFlag'];

  /** 묶음배송여부 @default(false) */
  @IsBoolean()
  @IsOptional()
  bundleFlag?: Order['bundleFlag'];

  /** String? // 현금영수증번호 */
  @IsString()
  @IsOptional()
  cashReceipts?: Order['cashReceipts'];

  /** 주문에 연결된 주문상품들 */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  /** 주문에 연결된 결제정보 
   // TODO: 결제api 작업 후 IsOptional(), optional? 삭제 하여 결제정보가 있는 주문만 생성 가능하도록 해야함
   */
  // @IsNotEmptyObject()
  @IsOptional()
  payment?: OrderPayment;
}
