import { OnQueueActive, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { OrderPayment } from '@prisma/client';
import { Job } from 'bull';
import { ShutdownManager } from '../shutdown-manager/shutdown.manager';

import { QueueKey } from './virtual-account.constant';
import { VirtualAccountServiceProxy } from './virtual-account.proxy.service';

/** 가상계좌 미입금 큐에 대한 처리 Consumer */
@Processor(QueueKey)
export class VirtualAccountConsumer {
  private readonly logContext = `😊 ${VirtualAccountConsumer.name}`;

  constructor(
    private readonly virtualAccountService: VirtualAccountServiceProxy,
    private readonly shutdownManager: ShutdownManager,
  ) {}

  /** 가상계좌 미입금 주문취소/결제취소 Job 핸들러 */
  @Process('makePaymentFail')
  public async makePaymentFail(job: Job<OrderPayment>): Promise<number> {
    const payment = job.data;
    return this.virtualAccountService.makePaymentFail(payment);
  }

  /** Queue Job 시작시 */
  @OnQueueActive()
  public async onQueueActive(job: Job<OrderPayment>): Promise<void> {
    Logger.log(
      `가상계좌 임금기간만료 처리 시작(job.id:${job.id},job.name:${job.name})`,
      this.logContext,
    );
  }

  /** Queue Job 완료시 */
  @OnQueueCompleted()
  public async onGlobalCompleted(job: Job<OrderPayment>): Promise<void> {
    const remainJobs = await job.queue.getJobs([
      'active',
      'delayed',
      'paused',
      'waiting',
    ]);
    Logger.log(
      `가상계좌 임금기간만료 처리 완료(job.id:${job.id}, 남은 작업: ${remainJobs.length}개)`,
      this.logContext,
    );
    // Queue에 남은 Job이 없다면 애플리케이션 셧다운 작업 실행
    if (remainJobs.length === 0) this.shutdownManager.shutdown();
    else {
      job.queue.resume(true);
    }
  }
}
