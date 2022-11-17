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
import { Order } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CreateOrderDto,
  CreateOrderShippingDto,
  FindAllOrderByBroadcasterRes,
  FindManyDto,
  GetNonMemberOrderDetailDto,
  GetOneOrderDetailDto,
  GetOrderDetailsForSpreadsheetDto,
  GetOrderListDto,
  NonMemberOrderDetailRes,
  OrderDetailRes,
  OrderListRes,
  OrderPurchaseConfirmationDto,
  OrderShippingCheckDto,
  OrderStatsRes,
  ShippingCostByShippingGroupId,
  UpdateOrderDto,
} from '@project-lc/shared-types';
import { OrderService } from './order.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('order', 'export')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** 구매확정하기 */
  @UseGuards(JwtAuthGuard)
  @Post('purchase-confirm')
  purchaseConfirm(
    @Body(new ValidationPipe({ transform: true })) dto: OrderPurchaseConfirmationDto,
  ): Promise<boolean> {
    return this.orderService.purchaseConfirm(dto);
  }

  /** 주문생성 - 비회원도 주문이 가능하도록 가드 @UseGuards(JwtAuthGuard) 적용하지 않아야 함 */
  @Post()
  async createOrder(
    @Body('order', new ValidationPipe({ transform: true })) order: CreateOrderDto,
    @Body('shipping', ValidationPipe) { shipping }: CreateOrderShippingDto,
  ): Promise<Order> {
    const result = await this.orderService.createOrder({
      orderDto: order,
      shippingData: shipping,
    });
    if (order.supportOrderIncludeFlag) {
      this.orderService.triggerPurchaseMessage(order);
    }
    return result;
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
  ): Promise<NonMemberOrderDetailRes> {
    return this.orderService.getNonMemberOrderDetail(dto);
  }

  /** 내보내기 - 여러주문 상세조회 */
  @Get('details')
  async findOrderDetails(
    @Query(new ValidationPipe({ transform: true })) dto: GetOrderDetailsForSpreadsheetDto,
  ): Promise<OrderDetailRes[]> {
    const result = await Promise.all(
      dto.orderIds.map((orderId) => {
        return this.orderService.getOrderDetail({ orderId, sellerId: dto.sellerId });
      }),
    );
    return result;
  }

  /** 개별 주문 상세조회 */
  @Get('detail')
  getOrderDetail(
    @Query(new ValidationPipe({ transform: true })) dto: GetOneOrderDetailDto,
  ): Promise<OrderDetailRes> {
    return this.orderService.getOrderDetail(dto);
  }

  /** 주문목록조회
   * @Query customerId? 해당 값이 있으면 특정 소비자의 삭제되지 않은 주문 목록 조회 & 선물주문인경우 받는사람관련정보 ''로 처리
   * @Query take 기본 10개
   * @Query skip?
   */
  @UseGuards(JwtAuthGuard)
  @Get('')
  getOrderList(
    @Query(new ValidationPipe({ transform: true })) dto: GetOrderListDto,
  ): Promise<OrderListRes> {
    // 특정 소비자의 주문 조회
    if (dto.customerId) {
      return this.orderService.getCustomerOrderList(dto);
    }
    // 특정 판매자의 주문 조회(해당 판매자의 판매상품만 표시 & 주문의 상태도 주문상품옵션의 상태에 따라 다르게 표시)
    if (dto.sellerId) {
      return this.orderService.getSellerOrderList(dto);
    }
    // 전체 주문 조회(모든 주문 && 삭제된 주문도 조회)
    return this.orderService.getOrderList(dto);
  }

  /*
   * 관리자/판매자 사용 - 주문정보 수정
   */
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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

  /** 주문을 생성하기 전 주문에 적용될 배송비 조회
    => 배송비 조회 위한 {주문상품id, 옵션id, 개수}[] 정보를 쿼리스트링으로 받고있다 
    주문내역이 길면 문제가 생길 우려가 있다
   */
  @Get('/shipping/check')
  checkOrderShippingCost(
    @Query(new ValidationPipe({ transform: true }))
    dto: OrderShippingCheckDto,
  ): Promise<ShippingCostByShippingGroupId> {
    return this.orderService.checkOrderShippingCost(dto);
  }
}
