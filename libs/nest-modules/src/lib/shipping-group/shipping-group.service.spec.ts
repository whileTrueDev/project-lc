import { Test, TestingModule } from '@nestjs/testing';
import { ShippingGroupService } from './shipping-group.service';

describe('ShippingGroupService', () => {
  let service: ShippingGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingGroupService],
    }).compile();

    service = module.get<ShippingGroupService>(ShippingGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
