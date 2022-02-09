import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@project-lc/prisma-orm';
import redisCacheStore from 'cache-manager-ioredis';
import { OrderCancelController } from './order-cancel.controller';
import { OrderCancelService } from './order-cancel.service';

describe('OrderCancelController', () => {
  let controller: OrderCancelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({ isGlobal: true, store: redisCacheStore })],
      controllers: [OrderCancelController],
      providers: [OrderCancelService, PrismaService],
    }).compile();

    controller = module.get<OrderCancelController>(OrderCancelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
