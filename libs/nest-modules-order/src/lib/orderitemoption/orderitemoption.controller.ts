import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { OrderItemOption } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { UpdateOrderItemOptionDto } from '@project-lc/shared-types';
import { OrderItemOptionService } from './orderitemoption.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('order')
@Controller('order-item-option')
export class OrderItemOptionController {
  constructor(private readonly service: OrderItemOptionService) {}

  /** 주문상품옵션의 상태를 변경
   * 주문에는 여러 상품이 포함되어 있고, 상품마다 상태가 다를 수 있다
   */
  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateOrderItemOptionDto,
  ): Promise<OrderItemOption> {
    return this.service.update(id, dto);
  }
}
