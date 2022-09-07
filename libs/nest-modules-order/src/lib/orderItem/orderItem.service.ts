import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  FindReviewNeededOrderItemsDto,
  OrderItemReviewNeededRes,
} from '@project-lc/shared-types';

@Injectable()
export class OrderItemService {
  constructor(private readonly prisma: PrismaService) {}

  /** 리뷰 작성 가능한 상품 조회 */
  public async findReviewNeededOrderItems(
    dto: FindReviewNeededOrderItemsDto,
  ): Promise<OrderItemReviewNeededRes> {
    return this.prisma.orderItem.findMany({
      where: {
        reviewId: null,
        order: { customerId: dto.customerId },
        options: {
          every: { step: { in: ['shippingDone', 'purchaseConfirmed'] } },
        },
        goodsId: { not: null },
        // 리뷰 작성 가능한 시간제한이 있다면 여기에 추가
      },
      include: {
        options: true,
        goods: {
          select: {
            goods_name: true,
            image: true,
          },
        },
      },
    });
  }
}
