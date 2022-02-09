import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@project-lc/prisma-orm';
import redisCacheStore from 'cache-manager-ioredis';
import { OrderCancelService } from './order-cancel.service';

describe('OrderCancelService', () => {
  let service: OrderCancelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true, store: redisCacheStore })],
      providers: [OrderCancelService, PrismaService],
    }).compile();

    service = module.get<OrderCancelService>(OrderCancelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
