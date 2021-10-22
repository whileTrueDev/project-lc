import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard, SellerInfo, UserPayload } from '@project-lc/nest-modules';
import { SellerOrderCancelRequestDto } from '@project-lc/shared-types';
import { OrderCancelService } from './order-cancel.service';

@Controller('order-cancel')
export class OrderCancelController {
  constructor(private readonly orderCancelService: OrderCancelService) {}

  /** 판매자 주문취소 요청 생성 */
  @UseGuards(JwtAuthGuard)
  @Post()
  createOrderCancelRequest(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: SellerOrderCancelRequestDto,
  ): Promise<any> {
    return this.orderCancelService.createOrderCancelRequst({
      sellerEmail: seller.sub,
      ...dto,
    });
  }

  /** 판매자 주문취소 요청 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('/:orderSeq')
  findOneOrderCancelRequst(
    @SellerInfo() seller: UserPayload,
    @Param('orderSeq') orderSeq: string,
  ): Promise<any> {
    console.log({ orderSeq });
    return this.orderCancelService.findOneOrderCancelRequst({
      orderSeq,
      sellerEmail: seller.sub,
    });
  }
}
