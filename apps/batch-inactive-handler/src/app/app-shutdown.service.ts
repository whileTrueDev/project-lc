import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class AppShutdownService implements OnModuleDestroy {
  private shutdownListener$: Subject<void> = new Subject();
  private logger: Logger = new Logger('MailerTaskService');

  onModuleDestroy(): void {
    this.logger.log('Executing OnDestroy Hook');
  }

  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  shutdown(): void {
    this.shutdownListener$.complete();
  }

  onApplicationShutdown(): void {
    this.logger.log('Shutdown');
  }
}
