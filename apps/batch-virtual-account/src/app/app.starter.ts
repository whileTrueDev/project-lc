import { Injectable } from '@nestjs/common';
import { ShutdownManager } from './shutdown-manager/shutdown.manager';
import { VirtualAccountProducer } from './virtual-account/virtual-account.producer';
import { VirtualAccountServiceProxy } from './virtual-account/virtual-account.proxy.service';

@Injectable()
export class AppStarter {
  constructor(
    private readonly virtualAccountService: VirtualAccountServiceProxy,
    private readonly virtualAccountProducer: VirtualAccountProducer,
    private readonly shutdownManager: ShutdownManager,
  ) {}

  /** 애플리케이션 작업 시작점 */
  public async start(): Promise<void> {
    const result = await this.virtualAccountService.findOutOfDateVirtualAccountPayment();
    if (result.length === 0) {
      // 처리할 목록 없는 경우 배치프로그램 셧다운
      await this.shutdownManager.shutdown();
    }
    await Promise.all(
      result.map((payment) => {
        return this.virtualAccountProducer.makePaymentFail(payment);
      }),
    );
  }
}

export default AppStarter;
