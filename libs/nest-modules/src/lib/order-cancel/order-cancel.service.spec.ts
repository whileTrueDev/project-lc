import { Test, TestingModule } from '@nestjs/testing';
import { OrderCancelService } from './order-cancel.service';

describe('OrderCancelService', () => {
  let service: OrderCancelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCancelService],
    }).compile();

    service = module.get<OrderCancelService>(OrderCancelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
