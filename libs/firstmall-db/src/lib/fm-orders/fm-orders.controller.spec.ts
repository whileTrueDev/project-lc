import { CacheModule, ExecutionContext } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfig } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { GoodsModule, GoodsService } from '@project-lc/nest-modules-goods';
import {
  LiveShoppingModule,
  LiveShoppingService,
} from '@project-lc/nest-modules-liveshopping';
import { ProductPromotionService } from '@project-lc/nest-modules-product-promotion';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { PrismaModule } from '@project-lc/prisma-orm';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import request from 'supertest';
import {
  orderDetailExportsSample,
  orderDetailItemsSample,
  orderDetailRefundsSample,
  orderDetailReturnsSample,
  orderMetaInfoSample,
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

  const TEST_ID = 3;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        GoodsModule.withoutControllers(),
        LiveShoppingModule.withoutControllers(),
        BroadcasterModule.withoutControllers(),
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync({
          isGlobal: true,
          useClass: CacheConfig,
        }),
        SellerModule.withoutControllers(),
      ],
      controllers: [FmOrdersController],
      providers: [
        FmOrdersService,
        FirstmallDbService,
        LiveShoppingService,
        ProductPromotionService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: TEST_ID, type: 'seller' };
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
      .mockImplementation(async (sellerId: number) => {
        if (sellerId !== TEST_ID) return [];
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
