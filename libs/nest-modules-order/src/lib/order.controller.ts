import { Body, Controller, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Order } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { CreateOrderDto } from '@project-lc/shared-types';
import { OrderService } from './order.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** 주문생성 */
  @Post()
  createOrder(@Body(ValidationPipe) dto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(dto);
  }

  /** 주문목록조회 */

  /** 개별주문조회 */

  /** 주문수정 */

  /** 주문 삭제 */
}
