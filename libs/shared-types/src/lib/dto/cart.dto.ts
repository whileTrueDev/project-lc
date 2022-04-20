import { CartItem, CartItemOption, CartItemSupport, Customer } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/** 카트 상품 옵션 정보 DTO */
export class CartItemOptionDto {
  @IsNumber() discountPrice: CartItemOption['discountPrice'];
  @IsNumber() normalPrice: CartItemOption['normalPrice'];
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
}

/** 카트 상품 정보 DTO */
export class CartItemDto {
  @IsNumber() goodsId: CartItem['goodsId'];
  @IsOptional() @IsNumber() customerId?: CartItem['customerId'];
  @IsOptional() @IsString() tempUserId?: CartItem['tempUserId'];
  @IsNumber() shippingGroupId: CartItem['shippingGroupId'];
  @IsDecimal() shippingCost: CartItem['shippingCost'];
  @IsBoolean() shippingCostIncluded: CartItem['shippingCostIncluded'];

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
  @IsNumber({}, { each: true })
  cartItemIds: CartItem['id'][];

  @IsNumber() customerId: Customer['id'];
}
