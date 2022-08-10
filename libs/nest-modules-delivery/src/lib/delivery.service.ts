import { Injectable } from '@nestjs/common';
import { Export } from '@prisma/client';
import { ExportService } from '@project-lc/nest-modules-export';
import { PrismaService } from '@project-lc/prisma-orm';
import { DeliveryDto } from '@project-lc/shared-types';

/**
 * 배송과정 이벤트처리 로직 서비스
 */
@Injectable()
export class DeliveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly expService: ExportService,
  ) {}

  /** 배송시작(배송중)/완료 처리 핸들러 */
  private async handleDelivery(dto: DeliveryDto): Promise<Export> {
    const { exportCode, status } = dto;
    // 출고 상태 변경
    const exp = await this.prisma.export.update({
      where: { exportCode },
      data: { status },
      include: { items: true },
    });
    // 출고 아이템 상태 변경
    await Promise.all(
      exp.items.map((expItem) =>
        this.prisma.exportItem.update({ where: { id: expItem.id }, data: { status } }),
      ),
    );
    /** 출고상품에 포함되는 주문상품옵션들의 상태변경 */
    const oioIds = exp.items.map((ei) => ei.orderItemOptionId);
    await this.prisma.orderItemOption.updateMany({
      where: { id: { in: oioIds } },
      data: { step: status },
    });
    /** 주문상품옵션상태변경 후 해당 주문의 상태변경 */
    await this.expService.updateOrderStatus(exp);
    return exp;
  }

  /** 배송시작 이벤트 핸들러 */
  public async deliveryStart(dto: DeliveryDto): Promise<Export> {
    // 향후 Noti 알림처리 등 handleDelivery와 독립적인 작업을 여기에 추가할 수 있을 것.
    return this.handleDelivery(dto);
  }

  /** 배송완료 이벤트 핸들러 */
  public async deliveryDone(dto: DeliveryDto): Promise<Export> {
    // 향후 Noti 알림처리 등 handleDelivery와 독립적인 작업을 여기에 추가할 수 있을 것.
    return this.handleDelivery(dto);
  }
}
