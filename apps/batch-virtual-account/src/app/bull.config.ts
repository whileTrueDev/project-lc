import { SharedBullConfigurationFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Bull, { QueueOptions } from 'bull';
import IORedis from 'ioredis';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  private getLimiterConfig(): Bull.RateLimiter {
    let max: number;
    const envMax = this.configService.get<string | undefined>('MAX_QUEUE_EXEC_SIZE');
    if (!envMax || Number.isNaN(Number(envMax))) max = 5;
    return {
      max,
      duration: 5000,
    };
  }

  private getRedisConfig(): IORedis.RedisOptions {
    let host = 'localhost';
    let port = 6401;
    const redis = this.configService.get<string>('REDIS_BULL_QUEUE_URL');
    const [envHost, envPort] = redis.split(':');
    if (envHost) host = envHost;
    if (envPort) port = Number(envPort);
    if (Number.isNaN(port)) port = 6401;
    return { host, port };
  }

  createSharedConfiguration(): QueueOptions | Promise<QueueOptions> {
    return {
      redis: this.getRedisConfig(),
      limiter: this.getLimiterConfig(),
      defaultJobOptions: { removeOnComplete: true },
    };
  }
}
