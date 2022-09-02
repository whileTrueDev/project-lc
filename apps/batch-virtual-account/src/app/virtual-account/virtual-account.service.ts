import { Injectable } from '@nestjs/common';
import {
  OrderPayment,
  OrderProcessStep,
  PaymentMethod,
  VirtualAccountDepositStatus,
} from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import type { VirtualAccountServiceInterface } from './virtual-account.interface';

/** 가상계좌 미입금 처리 관련 로직 */
@Injectable()
export class VirtualAccountService implements VirtualAccountServiceInterface {
  constructor(private readonly prisma: PrismaService) {}

  /** 입금 기한이 지난 가상계좌 결제목록을 조회 */
  public async findOutOfDateVirtualAccountPayment(): Promise<OrderPayment[]> {
    const now = new Date();
    return this.prisma.orderPayment.findMany({
      where: {
        depositDoneFlag: false,
        depositStatus: { not: VirtualAccountDepositStatus.CANCELED },
        method: PaymentMethod.virtualAccount,
        depositDueDate: {
          lt: now, // DueDate가 현재보다 작은 경우만(기한을 넘은 경우)
        },
      },
    });
  }

  /** 가상계좌 미입금에 따른 결제취소, 주문취소 처리 */
  public async makePaymentFail(payment: OrderPayment): Promise<number> {
    const result = await this.prisma.$transaction([
      // 결제취소처리(미입금처리)
      this.prisma.orderPayment.update({
        where: { id: payment.id },
        data: {
          depositStatus: VirtualAccountDepositStatus.CANCELED,
          depositDate: null,
          depositDoneFlag: true,
        },
      }),

      // 주문상품취소처리
      this.prisma.orderItemOption.updateMany({
        where: { orderItem: { orderId: payment.orderId } },
        data: { step: OrderProcessStep.paymentFailed },
      }),
    ]);
    return result.length;
  }
}

export default VirtualAccountService;
