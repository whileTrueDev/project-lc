import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class ShutdownManager {
  private shutdownListeners: Subject<void> = new Subject();
  private readonly logContext = `😈 ${ShutdownManager.name}`;

  /** 애플리케이션 종료 핸들러 */
  async shutdown(): Promise<void> {
    Logger.log(`Shutdown triggered.`, this.logContext);
    return this.shutdownListeners.next();
  }

  /** 애플리케이션 종료 구독함수.
   * app.close()를 service단에서 사용할수 없어, 이에 대한 방안으로 rxjs 구독을 활용 */
  subscribeToShutdown(shutdownCallback: () => void): void {
    this.shutdownListeners.subscribe(() => shutdownCallback());
  }
}
