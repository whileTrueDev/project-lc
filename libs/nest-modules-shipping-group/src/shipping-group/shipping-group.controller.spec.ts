import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfig } from '@project-lc/nest-core';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ShippingGroupController } from './shipping-group.controller';
import { ShippingGroupService } from './shipping-group.service';

describe('ShippingGroupController', () => {
  let app: NestApplication;
  let controller: ShippingGroupController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync({
          isGlobal: true,
          useClass: CacheConfig,
        }),
      ],
      providers: [ShippingGroupService],
      controllers: [ShippingGroupController],
    }).compile();

    controller = module.get<ShippingGroupController>(ShippingGroupController);

    app = module.createNestApplication();
    app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
