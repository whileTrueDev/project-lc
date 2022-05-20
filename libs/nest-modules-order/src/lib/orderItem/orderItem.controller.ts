import { Controller, Get, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  FindReviewNeededOrderItemsDto,
  OrderItemReviewNeededRes,
} from '@project-lc/shared-types';
import { OrderItemService } from './orderItem.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('order-item')
export class OrderItemController {
  constructor(private readonly service: OrderItemService) {}

  /** 리뷰 작성 가능한 상품 조회 */
  @Get('review-needed')
  findReviewNeededOrderItems(
    @Query(new ValidationPipe({ transform: true })) dto: FindReviewNeededOrderItemsDto,
  ): Promise<OrderItemReviewNeededRes> {
    return this.service.findReviewNeededOrderItems(dto);
  }
}
