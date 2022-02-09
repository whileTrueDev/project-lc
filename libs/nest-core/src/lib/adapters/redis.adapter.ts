import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { ServerOptions } from 'socket.io';

dotenv.config();

export class RedisIoAdapter extends IoAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    let pubClient: Redis.Cluster | Redis.Redis;
    if (['production', 'test'].includes(process.env.NODE_ENV)) {
      pubClient = new Redis.Cluster([process.env.REDIS_URL]);
    } else {
      pubClient = new Redis('localhost:6379');
    }
    const subClient = pubClient.duplicate();
    const redisAdapter = createAdapter(pubClient, subClient);

    server.adapter(redisAdapter);
    return server;
  }
}
