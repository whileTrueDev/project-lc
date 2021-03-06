import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class ShutdownManager {
  private shutdownListeners: Subject<void> = new Subject();
  private readonly logContext = `π ${ShutdownManager.name}`;

  /** μ νλ¦¬μΌμ΄μ μ’λ£ νΈλ€λ¬ */
  async shutdown(): Promise<void> {
    Logger.log(`Shutdown triggered.`, this.logContext);
    return this.shutdownListeners.next();
  }

  /** μ νλ¦¬μΌμ΄μ μ’λ£ κ΅¬λν¨μ.
   * app.close()λ₯Ό serviceλ¨μμ μ¬μ©ν μ μμ΄, μ΄μ λν λ°©μμΌλ‘ rxjs κ΅¬λμ νμ© */
  subscribeToShutdown(shutdownCallback: () => void): void {
    this.shutdownListeners.subscribe(() => shutdownCallback());
  }
}
