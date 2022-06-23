import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OrderPayment } from '@prisma/client';
import { Queue } from 'bull';
import { QueueKey } from './virtual-account.constant';

/** Queue Job 트리거 클래스 */
@Injectable()
export class VirtualAccountProducer {
  constructor(@InjectQueue(QueueKey) private readonly vaQueue: Queue) {}

  /** Queue makePaymentFail Job 트리거 */
  public async makePaymentFail(payment: OrderPayment): Promise<number | string> {
    const job = await this.vaQueue.add('makePaymentFail', payment);
    return job.id;
  }
}
