import { Injectable } from '@nestjs/common';
import { OrderItemOption } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { UpdateOrderItemOptionDto } from '@project-lc/shared-types';

@Injectable()
export class OrderItemOptionService {
  constructor(private readonly prisma: PrismaService) {}

  /** 주문옵션상품의 상태를 변경 */
  public async update(
    id: OrderItemOption['id'],
    dto: UpdateOrderItemOptionDto,
  ): Promise<OrderItemOption> {
    return this.prisma.orderItemOption.update({
      where: { id },
      data: { step: dto.step },
    });
  }
}
