import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { GetOrderListDto, OrderListRes, OrderDetailRes } from '@project-lc/shared-types';
import { OrderService } from '@project-lc/nest-modules-order';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('admin/order')
@Controller('admin/order')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  /** 주문목록조회
   * @Query customerId? 해당 값이 있으면 특정 소비자의 삭제되지 않은 주문 목록 조회 & 선물주문인경우 받는사람관련정보 ''로 처리
   * @Query take 기본 10개
   * @Query skip?
   */
  @Get('')
  getOrderList(
    @Query(new ValidationPipe({ transform: true })) dto: GetOrderListDto,
  ): Promise<OrderListRes> {
    const include = {
      sellerSettlementItems: {
        include: {
          SellerSettlements: {
            include: {
              seller: {
                select: {
                  sellerShop: true,
                },
              },
            },
          },
        },
      },
    };
    // 특정 소비자의 주문 조회
    if (dto.customerId) {
      return this.orderService.getCustomerOrderList(dto);
    }
    // 전체 주문 조회(모든 주문 && 삭제된 주문도 조회)
    return this.orderService.getOrderList(dto);
  }

  /** 개별 주문 상세조회 */
  @Get(':orderId')
  getOrderDetail(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderDetailRes> {
    return this.orderService.getOrderDetail(orderId);
  }
}
