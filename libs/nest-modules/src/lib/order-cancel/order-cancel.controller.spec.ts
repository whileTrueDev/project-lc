import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@project-lc/prisma-orm';
import { OrderCancelController } from './order-cancel.controller';
import { OrderCancelService } from './order-cancel.service';

describe('OrderCancelController', () => {
  let controller: OrderCancelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderCancelController],
      providers: [OrderCancelService, PrismaService],
    }).compile();

    controller = module.get<OrderCancelController>(OrderCancelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
