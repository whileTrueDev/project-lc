import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SellerOrderCancelRequest } from '@prisma/client';
import {
  CacheClearKeys,
  HttpCacheInterceptor,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-core';
import {
  OrderCancelRequestDetailRes,
  SellerOrderCancelRequestDto,
} from '@project-lc/shared-types';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { OrderCancelService } from './order-cancel.service';

/** @deprecated 더 이상 사용하지 않는 기능입니다 ./readme.md를 참고해주세요 */
@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('order-cancel')
@Controller('order-cancel')
export class OrderCancelController {
  constructor(private readonly orderCancelService: OrderCancelService) {}

  /** 판매자 결제취소 요청 생성 */
  @Post()
  createOrderCancelRequest(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: SellerOrderCancelRequestDto,
  ): Promise<SellerOrderCancelRequest> {
    return this.orderCancelService.createOrderCancelRequst({
      sellerId: seller.id,
      ...dto,
    });
  }

  /** 판매자 결제취소 요청 조회 */
  @Get('/:orderSeq')
  findOneOrderCancelRequst(
    @Param('orderSeq') orderSeq: string,
  ): Promise<OrderCancelRequestDetailRes> {
    return this.orderCancelService.getOneOrderCancelRequest(orderSeq);
  }
}
