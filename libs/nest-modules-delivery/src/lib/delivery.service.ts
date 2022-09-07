import { Injectable } from '@nestjs/common';
import { Export, ExportItem } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { DeliveryDto } from '@project-lc/shared-types';

/**
 * 배송과정 이벤트처리 로직 서비스
 */
@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 배송시작(배송중)/완료 처리 핸들러 */
  private async handleDelivery(dto: DeliveryDto): Promise<Export> {
    const { exportCode, status } = dto;
    const _exp = await this.prisma.export.findUnique({
      where: { exportCode },
      include: { items: true },
    });
    let bundleExports: (Export & { items: ExportItem[] })[] = [];
    let exportItems = _exp.items;
    if (!_exp.bundleExportCode) {
      // 출고 상태 변경
      await this.prisma.export.update({
        where: { exportCode },
        data: {
          status,
          shippingDoneDate: ['shippingDone', 'partialShippingDone'].includes(dto.status)
            ? new Date()
            : undefined,
        },
        include: { items: true },
      });
    } else {
      // * 합포장 출고인 경우
      // 합포장 출고 상태 변경
      const _bundleExports = await this.prisma.export.findMany({
        where: { bundleExportCode: _exp.bundleExportCode },
        include: { items: true },
      });
      bundleExports = bundleExports.concat(_bundleExports);
      exportItems = exportItems.concat(bundleExports.flatMap((bei) => bei.items));

      // 합포장 출고인 경우 함께 합포장된 출고 상태를 변경
      await this.prisma.export.updateMany({
        where: { bundleExportCode: _exp.bundleExportCode },
        data: {
          status,
          shippingDoneDate: ['shippingDone', 'partialShippingDone'].includes(dto.status)
            ? new Date()
            : undefined,
        },
      });
    }
    // 출고 아이템 상태 변경
    await Promise.all(
      exportItems.map((expItem) =>
        this.prisma.exportItem.update({ where: { id: expItem.id }, data: { status } }),
      ),
    );

    /** 출고상품에 포함되는 주문상품옵션들의 상태변경 */
    const oioIds = exportItems.map((ei) => ei.orderItemOptionId);
    await this.prisma.orderItemOption.updateMany({
      where: { id: { in: oioIds } },
      data: { step: status },
    });
    return _exp;
  }

  /** 배송시작 이벤트 핸들러 */
  public async deliveryStart(dto: DeliveryDto): Promise<Export> {
    // 향후 Noti 알림처리 등 handleDelivery와 독립적인 작업을 여기에 추가할 수 있을 것.
    return this.handleDelivery(dto);
  }

  /** 배송시작 이벤트 핸들러 - 일괄처리 */
  public async deliveryStartMany(dto: DeliveryDto[]): Promise<Export[]> {
    return Promise.all(dto.map((deliveryDto) => this.handleDelivery(deliveryDto)));
  }

  /** 배송완료 이벤트 핸들러 */
  public async deliveryDone(dto: DeliveryDto): Promise<Export> {
    // 향후 Noti 알림처리 등 handleDelivery와 독립적인 작업을 여기에 추가할 수 있을 것.
    return this.handleDelivery(dto);
  }

  /** 배송완료 이벤트 핸들러 - 일괄처리 */
  public async deliveryDoneMany(dto: DeliveryDto[]): Promise<Export[]> {
    return Promise.all(dto.map((deliveryDto) => this.handleDelivery(deliveryDto)));
  }
}
