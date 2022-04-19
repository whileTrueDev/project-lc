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
import { CartItemDto, CartItemOptionQuantityDto } from '@project-lc/shared-types';
import { CartItemRes, CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** 특정 카트 상품 목록 조회 */
  @Get()
  find(
    @Query('customerId') customerId: Customer['id'],
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

  /** 특정 카트 상품 개수 수정 */
  @Patch('option/:optionId')
  updateCartItemOptionQuantity(
    @Param('optionId', ParseIntPipe) optionId: CartItemOption['id'],
    @Body(ValidationPipe) dto: CartItemOptionQuantityDto,
  ): Promise<CartItemOption> {
    return this.cartService.update(optionId, dto.quantity);
  }

  /** 특정 카트 상품 삭제 */
  @Delete(':cartItemId')
  delete(
    @Param('cartItemId', ParseIntPipe) cartItemId: CartItem['id'],
  ): Promise<boolean> {
    return this.cartService.delete(cartItemId);
  }
}
