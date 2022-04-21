import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Order } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { CreateOrderDto, GetOrderListDto } from '@project-lc/shared-types';
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

  /** 주문목록조회
   * @Query customerId? 특정 소비자의 주문목록 조회. 해당 값이 있으면 선물주문인경우 받는사람관련정보 '' 로 리턴함
   * @Query take 기본 10개
   * @Query skip?
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getOrderList(@Query() dto: GetOrderListDto): any {
    // 특정 소비자의 주문 조회
    if (dto.customerId) {
      return this.orderService.getCustomerOrderList(dto);
    }
    // 전체 주문 조회
    return this.orderService.getOrderList(dto);
  }

  /** 개별주문조회 */

  /** 주문수정 */

  /** 주문 삭제 */
}
