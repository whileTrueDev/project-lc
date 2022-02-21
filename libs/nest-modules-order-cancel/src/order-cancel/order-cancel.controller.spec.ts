import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfig } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { OrderCancelController } from './order-cancel.controller';
import { OrderCancelService } from './order-cancel.service';

describe('OrderCancelController', () => {
  let controller: OrderCancelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync({
          isGlobal: true,
          useClass: CacheConfig,
        }),
      ],
      controllers: [OrderCancelController],
      providers: [OrderCancelService, PrismaService],
    }).compile();

    controller = module.get<OrderCancelController>(OrderCancelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
