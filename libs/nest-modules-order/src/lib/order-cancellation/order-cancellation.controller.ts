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
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
  FindOrderCancelParams,
  GetOrderCancellationListDto,
  OrderCancellationDetailRes,
  OrderCancellationListRes,
  OrderCancellationRemoveRes,
  OrderCancellationUpdateRes,
  UpdateOrderCancellationStatusDto,
} from '@project-lc/shared-types';
import { OrderCancellationService } from './order-cancellation.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('order/cancellation')
@Controller('order/cancellation')
export class OrderCancellationController {
  constructor(private readonly orderCancellationService: OrderCancellationService) {}

  /* 주문취소 생성(소비자가 주문취소 요청 생성) */
  @Post()
  @CacheClearKeys('order')
  createOrderCancellation(
    @Body(ValidationPipe) dto: CreateOrderCancellationDto,
  ): Promise<CreateOrderCancellationRes> {
    return this.orderCancellationService.findOrCreateOrderCancellation(dto);
  }

  /** 주문취소코드로 특정 주문취소 상세조회 */
  @Get(':cancelCode')
  getOrderCancellationDetail(
    @Param() params: FindOrderCancelParams,
  ): Promise<OrderCancellationDetailRes> {
    return this.orderCancellationService.getOrderCancellationDetail(params);
  }

  /* 주문취소 내역 조회 */
  @Get('')
  getOrderCancellationList(
    @Query(new ValidationPipe({ transform: true })) dto: GetOrderCancellationListDto,
  ): Promise<OrderCancellationListRes> {
    return this.orderCancellationService.getOrderCancellationList(dto);
  }

  /* 주문취소 수정(판매자, 관리자가 주문취소처리상태 수정 및 거절사유 입력 등) */
  @Patch('/:orderCancellationId')
  updateOrderCancellationStatus(
    @Param('orderCancellationId', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateOrderCancellationStatusDto,
  ): Promise<OrderCancellationUpdateRes> {
    return this.orderCancellationService.updateOrderCancellationStatus(id, dto);
  }
}
