import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  FindReviewNeededOrderItemsDto,
  OrderItemReviewNeededRes,
} from '@project-lc/shared-types';

@Injectable()
export class OrderItemService {
  constructor(private readonly prisma: PrismaService) {}

  public async findReviewNeededOrderItems(
    dto: FindReviewNeededOrderItemsDto,
  ): Promise<OrderItemReviewNeededRes> {
    return this.prisma.orderItem.findMany({
      where: {
        reviewId: null,
        order: {
          customerId: dto.customerId,
          step: { in: ['shippingDone', 'purchaseConfirmed'] },
        },
        goodsId: { not: null },
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
