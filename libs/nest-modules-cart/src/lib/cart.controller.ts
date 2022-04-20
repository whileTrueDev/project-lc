import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CartItem, CartItemOption, Customer } from '@prisma/client';
import {
  CartItemDto,
  CartItemOptionQuantityDto,
  CartItemRes,
  CartMigrationDto,
} from '@project-lc/shared-types';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** 특정 카트 상품 목록 조회 */
  @Get()
  find(
    @Query('customerId') customerId?: Customer['id'],
    @Query('tempUserId') tempUserId?: CartItem['tempUserId'],
  ): Promise<CartItemRes> {
    return this.cartService.find({
      customerId: customerId ? Number(customerId) : undefined,
      tempUserId,
    });
  }

  /** 특정 카트 상품 등록 */
  @Post()
  create(@Body(ValidationPipe) dto: CartItemDto): Promise<CartItem> {
    return this.cartService.create(dto);
  }

  /** 특정 소비자(temp유저) 장바구니 상품 모두 삭제 */
  @Delete()
  deleteAllItem(
    @Query('customerId') customerId?: Customer['id'],
    @Query('tempUserId') tempUserId?: CartItem['tempUserId'],
  ): Promise<boolean> {
    return this.cartService.deleteAll({
      customerId: customerId ? Number(customerId) : undefined,
      tempUserId,
    });
  }

  /** 특정 장바구니 상품 삭제 */
  @Delete(':cartItemId')
  deleteItem(
    @Param('cartItemId', ParseIntPipe) cartItemId: CartItem['id'],
  ): Promise<boolean> {
    return this.cartService.delete({ cartItemId });
  }

  /** 특정 장바구니 상품옵션 개수 수정 */
  @Patch('option/:optionId')
  updateCartItemOptionQuantity(
    @Param('optionId', ParseIntPipe) optionId: CartItemOption['id'],
    @Body(ValidationPipe) dto: CartItemOptionQuantityDto,
  ): Promise<CartItemOption> {
    return this.cartService.update(optionId, dto.quantity);
  }

  /** 특정 장바구니 상품 옵션 삭제 */
  @Delete('option/:optionId')
  deleteItemOption(
    @Param('optionId', ParseIntPipe) optionId: CartItemOption['id'],
  ): Promise<boolean> {
    return this.cartService.delete({ cartItemOptionId: optionId });
  }

  /** temp유저의 장바구니 목록을 특정 소비자에게 이관 */
  @Post('migration')
  tempToCustomer(@Body(ValidationPipe) dto: CartMigrationDto): Promise<number> {
    return this.cartService.tempToCustomer(dto.cartItemIds, dto.customerId);
  }
}
