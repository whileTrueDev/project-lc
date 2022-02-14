import { CacheModule, ExecutionContext } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { GoodsModule, GoodsService } from '@project-lc/nest-modules-goods';
import {
  LiveShoppingModule,
  LiveShoppingService,
} from '@project-lc/nest-modules-liveshopping';
import { S3Service } from '@project-lc/nest-modules-s3';
import { PrismaModule } from '@project-lc/prisma-orm';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import store from 'cache-manager-ioredis';
import request from 'supertest';
import {
  SellerModule,
  SellerProductPromotionService,
} from '@project-lc/nest-modules-seller';
import {
  orderDetailExportsSample,
  orderDetailItemsSample,
  orderDetailRefundsSample,
  orderDetailReturnsSample,
  orderMetaInfoSample,
  sellTypeSample,
} from '../../__tests__/orderDetailSample';
import { ordersSample } from '../../__tests__/ordersSample';
import { FirstmallDbService } from '../firstmall-db.service';
import { FmOrdersController } from './fm-orders.controller';
import { FmOrdersService } from './fm-orders.service';

describe('FmOrdersController', () => {
  let app: NestApplication;
  let controller: FmOrdersController;
  let service: FmOrdersService;
  let goodsService: GoodsService;

  const TEST_EMAIL = 'test11@test.com';
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        GoodsModule.withoutControllers(),
        LiveShoppingModule.withoutControllers(),
        BroadcasterModule.withoutControllers(),
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true, store }),
        SellerModule,
      ],
      controllers: [FmOrdersController],
      providers: [
        FmOrdersService,
        FirstmallDbService,
        S3Service,
        LiveShoppingService,
        SellerProductPromotionService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { sub: TEST_EMAIL, type: 'seller' };
          return true;
        },
      })
      .overrideGuard(AdminGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<FmOrdersController>(FmOrdersController);
    service = module.get<FmOrdersService>(FmOrdersService);
    goodsService = module.get<GoodsService>(GoodsService);

    jest
      .spyOn(goodsService, 'findMyGoodsIds')
      .mockImplementation(async (email: string) => {
        if (email !== TEST_EMAIL) return [];
        return [999999];
      });
    jest.spyOn(service, 'findOrders').mockImplementation(async (ids: number[]) => {
      if (ids.length === 0) return [];
      return ordersSample;
    });

    app = module.createNestApplication();
    app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /fm-orders', () => {
    it('should be return 200', async () => {
      return request(app.getHttpServer())
        .get('/fm-orders?search=test')
        .expect(200, ordersSample);
    });
  });

  describe('GET /fm-orders', () => {
    const result: FindFmOrderDetailRes = {
      ...orderMetaInfoSample,
      items: orderDetailItemsSample,
      exports: orderDetailExportsSample,
      refunds: orderDetailRefundsSample,
      returns: orderDetailReturnsSample,
      totalPrice: '1000',
      totalEa: 1000,
      totalType: 10,
      sellTypes: sellTypeSample,
    };
    it('should be return 200', async () => {
      jest.spyOn(service, 'findOneOrder').mockImplementation(async (id: string) => {
        if (!id) return null;
        return result;
      });

      return request(app.getHttpServer()).get('/fm-orders/1234').expect(200, result);
    });
  });
});
