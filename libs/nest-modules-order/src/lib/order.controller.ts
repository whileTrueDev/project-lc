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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Order } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  CreateOrderDto,
  FindAllOrderByBroadcasterRes,
  FindManyDto,
  GetNonMemberOrderDetailDto,
  GetOrderListDto,
  OrderDetailRes,
  OrderListRes,
  OrderPurchaseConfirmationDto,
  OrderStatsRes,
  UpdateOrderDto,
} from '@project-lc/shared-types';
import { OrderService } from './order.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** 구매확정 */
  @Post('purchase-confirm')
  purchaseConfirm(
    @Body(ValidationPipe) dto: OrderPurchaseConfirmationDto,
  ): Promise<boolean> {
    return this.orderService.purchaseConfirm(dto);
  }

  /** 주문생성 */
  @Post()
  createOrder(@Body(ValidationPipe) dto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(dto);
  }

  /** 판매자 주문현황 조회 */
  @Get('stats')
  async getOrdersStats(
    @Query('sellerId', ParseIntPipe) sellerId: number,
  ): Promise<OrderStatsRes> {
    return this.orderService.getOrderStats(sellerId);
  }

  /** 비회원 주문 상세조회 - 가드 적용하지 않아야 함 */
  @Get('nonmember')
  getNonMemberOrderDetail(
    @Query(ValidationPipe) dto: GetNonMemberOrderDetailDto,
  ): Promise<OrderDetailRes> {
    return this.orderService.getNonMemberOrderDetail(dto);
  }

  /** 개별 주문 상세조회 */
  @Get(':orderId')
  getOrderDetail(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderDetailRes> {
    return this.orderService.getOrderDetail(orderId);
  }

  /** 주문목록조회
   * @Query customerId? 해당 값이 있으면 특정 소비자의 삭제되지 않은 주문 목록 조회 & 선물주문인경우 받는사람관련정보 ''로 처리
   * @Query take 기본 10개
   * @Query skip?
   */
  @Get('')
  getOrderList(
    @Query(new ValidationPipe({ transform: true })) dto: GetOrderListDto,
  ): Promise<OrderListRes> {
    // 특정 소비자의 주문 조회
    if (dto.customerId) {
      return this.orderService.getCustomerOrderList(dto);
    }
    // 전체 주문 조회(모든 주문 && 삭제된 주문도 조회)
    return this.orderService.getOrderList(dto);
  }

  /*
   * 관리자 | 판매자가 사용
   */
  @Patch(':orderId')
  updateOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body(ValidationPipe) dto: UpdateOrderDto,
  ): Promise<boolean> {
    return this.orderService.updateOrder(orderId, dto);
  }

  /** 주문 삭제
   * 완료된 주문만 삭제 가능
   * 데이터 삭제x, deleteFlag를 true로 설정함
   * */
  @Delete(':orderId')
  deleteOrder(@Param('orderId', ParseIntPipe) orderId: number): Promise<boolean> {
    return this.orderService.deleteOrder(orderId);
  }

  /** 방송인 후원 주문 목록 조회  */
  @Get('by-broadcaster/:broadcasterId')
  getOrderListByBroadcaster(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
    @Query(new ValidationPipe({ transform: true })) dto: FindManyDto,
  ): Promise<FindAllOrderByBroadcasterRes> {
    return this.orderService.findAllByBroadcaster(broadcasterId, dto);
  }
}
