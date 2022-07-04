import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderProcessStep, VirtualAccountDepositStatus } from '@prisma/client';
import { OrderService } from '@project-lc/nest-modules-order';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  KKsPaymentProviders,
  TossVirtualAccountTranslatedDto,
} from '@project-lc/shared-types';

@Injectable()
export class PaymentWebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  /**
   * TossPayment로부터 전달된 secret 값을 통해 가상계좌 웹훅 요청이 정상적인 요청인지를 검증.
   * 정상적인 경우 true를, 그렇지 않은 경우 false를 반환 */
  public async checkDepositSecret(
    provider: KKsPaymentProviders,
    dto: TossVirtualAccountTranslatedDto,
  ): Promise<boolean> {
    if (provider !== KKsPaymentProviders.TossPayments) return false;
    const targetPayment = await this.prisma.orderPayment.findFirst({
      where: { order: { orderCode: dto.orderCode } },
    });
    if (targetPayment?.depositSecret === dto.secret) return true;
    return false;
  }

  public async depositProcessing(
    provider: KKsPaymentProviders,
    dto: TossVirtualAccountTranslatedDto,
  ): Promise<boolean> {
    if (provider !== KKsPaymentProviders.TossPayments) return false;
    const order = await this.prisma.order.findUnique({
      where: { orderCode: dto.orderCode },
    });
    const targetPayment = await this.prisma.orderPayment.findUnique({
      where: { orderId: order.id },
    });
    if (!targetPayment) throw new NotFoundException('Target payment record not founded');
    switch (dto.status) {
      case 'DONE': {
        await this.prisma.orderPayment.update({
          where: { id: targetPayment.id },
          data: {
            depositDate: new Date(dto.createdAt),
            depositDoneFlag: true,
            depositStatus: VirtualAccountDepositStatus.DONE,
          },
        });
        await this.orderService.updateOrder(order.id, {
          step: OrderProcessStep.paymentConfirmed,
        });
        return true;
      }
      case 'WATING_FOR_DEPOSIT':
      case 'CANCELED': {
        await this.prisma.orderPayment.update({
          where: { id: targetPayment.id },
          data: { depositDate: null, depositDoneFlag: false },
        });
        await this.orderService.updateOrder(order.id, {
          step: OrderProcessStep.paymentCanceled,
        });
        return true;
      }
      case 'PARTIAL_CANCELED': {
        // 부분결제취소 = 여러 상품 중 부분만 취소의 경우?
        // 20220621 현재 그런 기능 없음. 향후 기능 추가 이후 작업 처리
        return true;
      }
      default:
        throw new BadRequestException('"status" field must be contained in request body');
    }
  }
}

export default PaymentWebhookService;
