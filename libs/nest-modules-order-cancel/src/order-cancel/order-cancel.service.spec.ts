import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfig } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { OrderCancelService } from './order-cancel.service';

describe('OrderCancelService', () => {
  let service: OrderCancelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync({
          isGlobal: true,
          useClass: CacheConfig,
        }),
      ],
      providers: [OrderCancelService, PrismaService],
    }).compile();

    service = module.get<OrderCancelService>(OrderCancelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
