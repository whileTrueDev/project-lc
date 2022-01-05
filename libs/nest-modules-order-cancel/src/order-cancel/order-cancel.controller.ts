import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SellerOrderCancelRequest } from '@prisma/client';
import { SellerInfo, UserPayload } from '@project-lc/nest-core';
import {
  OrderCancelRequestDetailRes,
  SellerOrderCancelRequestDto,
} from '@project-lc/shared-types';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { OrderCancelService } from './order-cancel.service';

@UseGuards(JwtAuthGuard)
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
      sellerEmail: seller.sub,
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
