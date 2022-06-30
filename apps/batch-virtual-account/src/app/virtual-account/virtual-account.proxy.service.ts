import { Injectable, Logger } from '@nestjs/common';
import { OrderPayment } from '@prisma/client';
import type { VirtualAccountServiceInterface } from './virtual-account.interface';
import VirtualAccountService from './virtual-account.service';

/** VirtualAccountService의 작업 앞 뒤로 로깅 추가한 Proxy클래스 */
@Injectable()
export class VirtualAccountServiceProxy implements VirtualAccountServiceInterface {
  private readonly loggerContext = `🌏 ${VirtualAccountServiceProxy.name}`;

  constructor(private readonly virtualAccountService: VirtualAccountService) {}
  public async findOutOfDateVirtualAccountPayment(): Promise<OrderPayment[]> {
    Logger.log('가상계좌 입금 기간 만료 목록 조회 시작', this.loggerContext);
    const result = await this.virtualAccountService.findOutOfDateVirtualAccountPayment();
    Logger.log(
      `가상계좌 입금 기간 만료 목록 조회 완료! - 총 ${result.length}개`,
      this.loggerContext,
    );
    return result;
  }

  public async makePaymentFail(payment: OrderPayment): Promise<number> {
    const logContext = `${this.loggerContext}|${payment.id}|`;
    Logger.log('가상계좌 미입금 주문/결제 취소 처리 시작', logContext);
    const result = await this.virtualAccountService.makePaymentFail(payment);
    Logger.log('가상계좌 미입금 주문/결제 취소 처리 완료!', logContext);
    return result;
  }
}
