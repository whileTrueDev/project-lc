import {
  CartItem,
  CartItemOption,
  CartItemSupport,
  Customer,
  LiveShopping,
  ProductPromotion,
  SellType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/** 카트 상품 옵션 정보 DTO */
export class CartItemOptionDto {
  @IsDecimal() discountPrice: CartItemOption['discountPrice'];
  @IsDecimal() normalPrice: CartItemOption['normalPrice'];
  @IsNumber() quantity: CartItemOption['quantity'];
  @IsNumber() goodsOptionsId: CartItemOption['goodsOptionsId'];
  @IsOptional() @IsString() name?: CartItemOption['name'];
  @IsOptional() @IsString() value?: CartItemOption['value'];
  @IsOptional() @IsNumber() weight?: CartItemOption['weight'];
}

/** 카트 상품 후원 정보 DTO */
export class CartItemSupportDto {
  @IsNumber() broadcasterId: CartItemSupport['broadcasterId'];
  @IsString() nickname: CartItemSupport['nickname'];
  @IsOptional() @IsString() message?: CartItemSupport['message'];
  /** 후원이 발생된 liveShopping 고유번호 */
  @IsOptional() @IsNumber() liveShoppingId?: LiveShopping['id'];
  /** 후원이 발생된 productPromotion 고유번호 */
  @IsOptional() @IsNumber() productPromotionId?: ProductPromotion['id'];
}

/** 카트 상품 정보 DTO */
export class CartItemDto {
  @IsNumber() goodsId: CartItem['goodsId'];
  @IsOptional() @IsNumber() customerId?: CartItem['customerId'];
  @IsOptional() @IsString() tempUserId?: CartItem['tempUserId'];
  @IsOptional() @IsNumber() shippingGroupId?: CartItem['shippingGroupId'];

  // 유입 상품의 경로 정보
  @IsEnum(SellType) channel: SellType;

  @ValidateNested({ each: true })
  @Type(() => CartItemOptionDto)
  @IsArray()
  options: CartItemOptionDto[];

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => CartItemSupportDto)
  support?: CartItemSupportDto;
}

export class CartItemOptionQuantityDto {
  @IsNumber() quantity: CartItemOption['quantity'];
}

export class CartMigrationDto {
  @IsString() tempUserId: CartItem['tempUserId'];
  @IsNumber() customerId: Customer['id'];
}
