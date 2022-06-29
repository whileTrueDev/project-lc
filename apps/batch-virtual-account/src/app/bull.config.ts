import { SharedBullConfigurationFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Bull, { QueueOptions } from 'bull';
import IORedis from 'ioredis';
import { QueuePrefix } from './virtual-account/virtual-account.constant';

@Injectable()
export class BullConfig implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  private getLimiterConfig(): Bull.RateLimiter {
    let max: number;
    const envMax = this.configService.get<string | undefined>('MAX_QUEUE_EXEC_SIZE');
    if (!envMax || Number.isNaN(Number(envMax))) max = 2;
    return {
      max,
      duration: 5000,
    };
  }

  private getRedisConfig(): IORedis.RedisOptions {
    let host = 'localhost';
    let port = 6379;
    const redis = this.configService.get<string>('REDIS_BULL_QUEUE_URL');
    const [envHost, envPort] = redis.split(':');
    if (envHost) {
      host = envHost.includes('redis://') ? envHost.replace('redis://', '') : envHost;
    }
    if (envPort) port = Number(envPort);
    if (Number.isNaN(port)) port = 6379;
    return { host, port, maxRetriesPerRequest: null, enableReadyCheck: false };
  }

  createSharedConfiguration(): QueueOptions | Promise<QueueOptions> {
    return {
      prefix: QueuePrefix,
      redis: this.getRedisConfig(),
      limiter: this.getLimiterConfig(),
      createClient(_, redisOpts?) {
        return new IORedis.Cluster([redisOpts], { ...redisOpts });
      },
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
    };
  }
}
