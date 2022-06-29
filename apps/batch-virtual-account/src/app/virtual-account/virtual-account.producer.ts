import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { OrderPayment } from '@prisma/client';
import { Queue } from 'bull';
import { QueueKey } from './virtual-account.constant';

/** Queue Job 트리거 클래스 */
@Injectable()
export class VirtualAccountProducer implements OnModuleDestroy {
  private readonly logContext = `🤖 ${VirtualAccountProducer.name}`;

  constructor(@InjectQueue(QueueKey) private readonly vaQueue: Queue) {}

  public async onModuleDestroy(): Promise<void> {
    Logger.log(`Queue Cleaning started.`, this.logContext);
    const uptime = Math.floor(process.uptime() * 1000); // seconds to milliseconds
    await this.vaQueue
      .clean(uptime)
      .then((value) => {
        if (value.length > 0) Logger.log(`Queue cleaned.`, this.logContext);
        else Logger.log('The queue is already clean.', this.logContext);
      })
      .catch((err) => {
        Logger.warn(`Error occurred during cleaning queue`, this.logContext);
        console.log(err);
      });
  }

  /** Queue makePaymentFail Job 트리거 */
  public async makePaymentFail(payment: OrderPayment): Promise<number | string> {
    const job = await this.vaQueue.add('makePaymentFail', payment);
    return job.id;
  }
}
