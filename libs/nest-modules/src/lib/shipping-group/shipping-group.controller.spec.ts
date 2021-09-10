import { Test, TestingModule } from '@nestjs/testing';
import { ShippingGroupController } from './shipping-group.controller';

describe('ShippingGroupController', () => {
  let controller: ShippingGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingGroupController],
    }).compile();

    controller = module.get<ShippingGroupController>(ShippingGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
