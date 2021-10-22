import { Test, TestingModule } from '@nestjs/testing';
import { OrderCancelController } from './order-cancel.controller';

describe('OrderCancelController', () => {
  let controller: OrderCancelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderCancelController],
    }).compile();

    controller = module.get<OrderCancelController>(OrderCancelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
