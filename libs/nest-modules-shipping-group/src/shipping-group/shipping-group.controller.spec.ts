import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ShippingGroupController } from './shipping-group.controller';
import { ShippingGroupService } from './shipping-group.service';

describe('ShippingGroupController', () => {
  let app: NestApplication;
  let service: ShippingGroupService;
  let controller: ShippingGroupController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShippingGroupService],
      controllers: [ShippingGroupController],
    }).compile();

    controller = module.get<ShippingGroupController>(ShippingGroupController);
    service = module.get<ShippingGroupService>(ShippingGroupService);

    app = module.createNestApplication();
    app.init();
  });

  afterAll(async () => {
    if (app) app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
