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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Order } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  CreateOrderDto,
  GetNonMemberOrderDetailDto,
  GetOrderListDto,
  UpdateOrderDto,
} from '@project-lc/shared-types';
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
   * @Query customerId? 해당 값이 있으면 특정 소비자의 삭제되지 않은 주문 목록 조회 & 선물주문인경우 받는사람관련정보 ''로 처리
   * @Query take 기본 10개
   * @Query skip?
   */
  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  getOrderList(@Query() dto: GetOrderListDto): Promise<Order[]> {
    // 특정 소비자의 주문 조회
    if (dto.customerId) {
      return this.orderService.getCustomerOrderList(dto);
    }
    // 전체 주문 조회(모든 주문 && 삭제된 주문도 조회)
    return this.orderService.getOrderList(dto);
  }

  /** 개별 주문 상세조회 */
  @Get(':orderId')
  getOrderDetail(@Param('orderId', ParseIntPipe) orderId: number): Promise<Order> {
    return this.orderService.getOrderDetail(orderId);
  }

  /** 비회원 주문 상세조회 - 가드 적용하지 않아야 함 */
  @Get()
  getNonMemberOrderDetail(
    @Query(ValidationPipe) dto: GetNonMemberOrderDetailDto,
  ): Promise<Order> {
    return this.orderService.getNonMemberOrderDetail(dto);
  }

  /** 주문수정
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
}