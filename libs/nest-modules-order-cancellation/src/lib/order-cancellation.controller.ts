import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
  GetOrderCancellationListDto,
  OrderCancellationListRes,
} from '@project-lc/shared-types';
import { OrderCancellationService } from './order-cancellation.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('order-cancellation')
export class OrderCancellationController {
  constructor(private readonly orderCancellationService: OrderCancellationService) {}

  /* 주문취소 생성(소비자가 주문취소 요청 생성) */
  @Post()
  createOrderCancellation(
    @Body(ValidationPipe) dto: CreateOrderCancellationDto,
  ): Promise<CreateOrderCancellationRes> {
    return this.orderCancellationService.createOrderCancellation(dto);
  }

  /* 주문취소 내역 조회 */
  @Get()
  getOrderCancellationList(
    @Query(new ValidationPipe({ transform: true })) dto: GetOrderCancellationListDto,
  ): Promise<OrderCancellationListRes> {
    return this.orderCancellationService.getOrderCancellationList(dto);
  }

  /* 주문취소 수정(판매자, 관리자가 주문취소처리상태 수정 및 거절사유 입력 등) */

  /* 주문취소 철회(소비자가 요청했던 주문취소 철회) */
}
