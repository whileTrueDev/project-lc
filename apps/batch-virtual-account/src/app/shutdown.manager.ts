import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { Subject } from 'rxjs';
import { QueueKey } from './virtual-account.constant';

@Injectable()
export class ShutdownManager {
  private shutdownListeners: Subject<void> = new Subject();
  private readonly logContext = `😈 ${ShutdownManager.name}`;

  constructor(@InjectQueue(QueueKey) private readonly queue: Queue) {}

  /** 애플리케이션 종료 핸들러 */
  async shutdown(): Promise<void> {
    Logger.log(`Shutdown triggered.`, this.logContext);
    // Queue Cleaning - 현재(220628 올바르게 작동하지 않음.) 향후 수정필요
    // const uptime = Math.floor(process.uptime() * 1000); // seconds to milliseconds
    // await this.queue
    //   .clean(uptime)
    //   .then((value) => {
    //     if (value.length > 0) Logger.log(`Queue cleaned.`, this.logContext);
    //   })
    //   .catch((err) => {
    //     Logger.warn(`Error occurred during cleaning queue`, this.logContext);
    //     console.log(err);
    //   });
    return this.shutdownListeners.next();
  }

  /** 애플리케이션 종료 구독함수.
   * app.close()를 service단에서 사용할수 없어, 이에 대한 방안으로 rxjs 구독을 활용 */
  subscribeToShutdown(shutdownCallback: () => void): void {
    this.shutdownListeners.subscribe(() => shutdownCallback());
  }
}
