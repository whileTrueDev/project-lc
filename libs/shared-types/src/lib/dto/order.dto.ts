import {
  Coupon,
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemSupport,
  OrderPayment,
  OrderProcessStep,
  PaymentMethod,
  SellType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

// ------------------생성 dto--------------------

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

  @IsOptional() avatar?: string | null;
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
  shippingCost: OrderItem['shippingCost'] | string;

  /**  이 주문 상품에 동일 판매자의 배송비가 포함되었는지 여부 @default(false)  */
  @IsBoolean()
  @IsOptional()
  shippingCostIncluded?: OrderItem['shippingCostIncluded'];

  /**  연결된 배송정책 id */
  @IsNumber()
  shippingGroupId: OrderItem['shippingGroupId'];

  @IsOptional()
  goodsName?: string;
}

/** 주문 Order 생성 dto */
export class CreateOrderDto {
  // TODO : orderCode 추가? 주문(결제)페이지에서부터 고유한 orderCode 값이 필요하다고 함. order 데이터 생성 전 orderCode는 미리 생성하고 order 데이터 생성시 해당 코드값을 dto에 추가해야 할 수도 있다

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
   // TODO: 결제api 작업 후 수정필요
   */
  // @IsNotEmptyObject()
  @IsOptional()
  payment?: OrderPayment;

  /** 주문으로 생성될 장바구니 상품들 id */
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  cartItemIdList?: number[];

  /** 마일리지 사용량 */
  @IsOptional() @IsNumber() usedMileageAmount?: number;
  /** 사용된 쿠폰 */
  @IsOptional() @IsNumber() couponId?: Coupon['id'];
  /** 쿠폰으로 할인받은 금액 */
  @IsOptional() @IsNumber() usedCouponAmount?: number;
  /** 총 할인 금액 */
  @IsOptional() @IsNumber() totalDiscount?: number;
}

/** 주문 Order 생성을 위한 react-hook-form 데이터 타입 */
export type CreateOrderForm = CreateOrderDto & {
  ordererPhone1?: string;
  ordererPhone2?: string;
  ordererPhone3?: string;
  paymentType: PaymentMethod;
};

// ------------------조회 dto--------------------
/** 주문 목록 조회 dto */
export class GetOrderListDto {
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

  /** 특정 소비자의 구매내역 조회시 사용. 소비자고유번호 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  customerId?: number;

  /** 특정 판매자의 상품 주문내역 조회시 사용. 판매자 고유번호 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sellerId?: number;

  /** 주문번호로 조회시 사용 */
  @IsString()
  @IsOptional()
  orderCode?: string;

  /** 기간조회시 어느 컬럼 기준으로 할지 정함 - 주문일 혹은 입금일(기본값 : 주문일) */
  @IsOptional()
  @IsIn(['주문일', '입금일'])
  searchDateType?: '주문일' | '입금일' = '주문일';

  /** 특정 기간내 주문 조회시 사용.
   * searchDateType 값에 따라 주문일 혹은 입금일을 기준으로 사용한다(기본값 : 주문일)
   * 조회할 기간 시작일자 2022-02-02 형태로 입력  https://github.com/typestack/class-validator/issues/407 */
  @IsISO8601()
  @IsOptional()
  periodStart?: string;

  /** 특정 기간내 주문 조회시 사용.
   * searchDateType 값에 따라 주문일 혹은 입금일을 기준으로 사용한다(기본값 : 주문일)
   * 조회할 기간 마지막일자 2022-02-02 형태로 입력 */
  @IsISO8601()
  @IsOptional()
  periodEnd?: string;

  /** 후원 주문만 조회시 사용 */
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  supportIncluded?: boolean;

  /** 특정검색어로 조회시 -> 해당검색어가 특정컬럼에 포함되는 주문 검색 */
  @IsOptional() @IsString() search?: string;

  /** 특정 상태인 주문 검색시 */
  @IsOptional()
  @IsEnum(OrderProcessStep, { each: true })
  searchStatuses?: OrderProcessStep[];
}

/** 비회원 주문 조회 dto */
export class GetNonMemberOrderDetailDto {
  /** 주문코드 */
  @IsString()
  orderCode: string;

  /** 비회원주문 비밀번호 */
  @IsString()
  password: string;
}

/** 내보내기 위한 주문상세 여러개 조회 dto */
export class GetOrderDetailsForSpreadsheetDto {
  @IsNumber({}, { each: true })
  @Type(() => Number)
  orderIds: Order['id'][];
}

// ------------------수정 dto--------------------
/** 주문 수정 dto */
export class UpdateOrderDto {
  /** 소비자 고유번호 */
  @IsNumber()
  @IsOptional()
  customerId?: Order['customerId'];

  /** 주문상태 */
  @IsEnum(OrderProcessStep)
  @IsOptional()
  step?: Order['step'];

  /** 비회원 주문인 경우 true로 보냄. @default(false) */
  @IsBoolean()
  @IsOptional()
  nonMemberOrderFlag?: Order['nonMemberOrderFlag'];

  /** 비회원 주문인 경우 입력받는 비밀번호 - 비회원이 주문조회, 취소시 사용할예정, 비회원주문인경우에만 validate */
  @IsString()
  @IsOptional()
  nonMemberOrderPassword?: Order['nonMemberOrderPassword'];

  /** 주문금액 = 실제 주문 상품/상품옵션 의 금액 합 */
  @IsNumber()
  @IsOptional()
  orderPrice?: Order['orderPrice'];

  /** 결제금액 = 할인(쿠폰,할인코드,마일리지 적용)이후 사용자가 실제 결제한 금액 */
  @IsNumber()
  @IsOptional()
  paymentPrice?: Order['paymentPrice'];

  /** 받는사람명 */
  @IsString()
  @IsOptional()
  recipientName?: Order['recipientName'];

  /** 받는사람 연락처 */
  @IsString()
  @IsOptional()
  recipientPhone?: Order['recipientPhone'];

  /** 받는사람 이메일 */
  @IsEmail()
  @IsOptional()
  recipientEmail?: Order['recipientEmail'];

  /** 받는사람 주소(배송지) 도로명 */
  @IsString()
  @IsOptional()
  recipientAddress?: Order['recipientAddress'];

  /** 받는사람 주소(배송지) 주소 상세 */
  @IsString()
  @IsOptional()
  recipientDetailAddress?: Order['recipientDetailAddress'];

  /** 받는사람 주소(배송지) 우편 번호 */
  @IsString()
  @IsOptional()
  recipientPostalCode?: Order['recipientPostalCode'];

  /** 주문자명 */
  @IsString()
  @IsOptional()
  ordererName?: Order['ordererName'];

  /** 주문자 연락처 */
  @IsString()
  @IsOptional()
  ordererPhone?: Order['ordererPhone'];

  /** 주문자 이메일 */
  @IsEmail()
  @IsOptional()
  ordererEmail?: Order['ordererEmail'];

  /** 배송메시지 */
  @IsString()
  @IsOptional()
  memo?: Order['memo'];

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

  /** 현금영수증번호 */
  @IsString()
  @IsOptional()
  cashReceipts?: Order['cashReceipts'];

  /** 삭제여부 */
  @IsBoolean()
  @IsOptional()
  deleteFlag?: Order['deleteFlag'];
}

/** 구매확정 dto */
export class OrderPurchaseConfirmationDto {
  /** 구매확정 할 주문상품옵션 고유번호 */
  @IsNumber()
  orderItemOptionId: OrderItemOption['id'];
}
