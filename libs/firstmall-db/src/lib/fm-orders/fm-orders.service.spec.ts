import { Test, TestingModule } from '@nestjs/testing';
import { FmOrdersService } from './fm-orders.service';

describe('FmOrdersService', () => {
  let service: FmOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FmOrdersService],
    }).compile();

    service = module.get<FmOrdersService>(FmOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
