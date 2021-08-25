import { ExecutionContext } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { GoodsModule, JwtAuthGuard } from '@project-lc/nest-modules';
import { PrismaModule } from '@project-lc/prisma-orm';
import request from 'supertest';
import { ordersSample } from '../../__tests__/ordersSample';
import { FirstmallDbService } from '../firstmall-db.service';
import { FmOrdersController } from './fm-orders.controller';
import { FmOrdersService } from './fm-orders.service';

describe('FmOrdersController', () => {
  let app: NestApplication;
  let controller: FmOrdersController;
  let service: FmOrdersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GoodsModule, PrismaModule],
      controllers: [FmOrdersController],
      providers: [FmOrdersService, FirstmallDbService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { sub: 'test@test.com', type: 'seller' };
          return true;
        },
      })
      .compile();

    controller = module.get<FmOrdersController>(FmOrdersController);
    service = module.get<FmOrdersService>(FmOrdersService);

    jest.spyOn(service, 'findOrders').mockImplementation(async () => ordersSample);

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
});
