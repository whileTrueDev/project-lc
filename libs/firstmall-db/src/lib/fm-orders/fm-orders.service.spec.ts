/* eslint-disable dot-notation */
import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfig } from '@project-lc/nest-core';
import {
  LiveShoppingModule,
  LiveShoppingService,
} from '@project-lc/nest-modules-liveshopping';
import { ProductPromotionService } from '@project-lc/nest-modules-product-promotion';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { PrismaModule } from '@project-lc/prisma-orm';
import { FindFmOrdersDto } from '@project-lc/shared-types';
import {
  orderDetailExportsSample,
  orderDetailOptionsSample,
  orderDetailRefundsSample,
  orderDetailReturnsSample,
} from '../../__tests__/orderDetailSample';
import { ordersSample } from '../../__tests__/ordersSample';
import { FirstmallDbService } from '../firstmall-db.service';
import { FmOrdersService } from './fm-orders.service';

describe('FmOrdersService', () => {
  let service: FmOrdersService;
  let db: FirstmallDbService;

  const testGoodsIds = [41];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CacheModule.registerAsync({
          isGlobal: true,
          useClass: CacheConfig,
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        SellerModule.withoutControllers(),
        LiveShoppingModule.withoutControllers(),
      ],
      providers: [
        FirstmallDbService,
        FmOrdersService,
        ProductPromotionService,
        LiveShoppingService,
      ],
    }).compile();

    service = module.get<FmOrdersService>(FmOrdersService);
    db = module.get<FirstmallDbService>(FirstmallDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('[Private Method] createFindOrdersQuery', () => {
    it('모든 DTO 필드가 주어진 경우', () => {
      const dto: FindFmOrdersDto = {
        search: 'test',
        searchDateType: '주문일',
        searchStartDate: '2020-08-23',
        searchEndDate: '2020-08-24',
        searchStatuses: ['25', '45', '55'],
      };
      const { sql, params } = service['createFindOrdersQuery'](testGoodsIds, dto);

      // 기본 select 구문이 올바르게 들어갔는 지 검사
      expect(sql).toContain('GROUP_CONCAT(fm_order_item.goods_seq SEPARATOR');
      expect(sql).toContain('FROM fm_order');
      expect(sql).toContain('JOIN fm_order_item USING(order_seq)');
      expect(sql).toContain('WHERE fm_order_item.goods_seq IN (41)');

      // where 구문이 올바르게 들어갔는 지 검사
      expect(sql).toContain('AND (DATE(regist_date) >= ? AND DATE(regist_date) <= ?)');
      expect(sql).toContain('OR fm_order.order_seq LIKE ?');
      expect(sql).toContain('OR REPLACE(fm_order.order_phone, "-", "") LIKE ?');
      expect(sql).toContain('OR REPLACE(fm_order.order_cellphone, "-", "") LIKE ?');
      expect(sql).toContain('OR REPLACE(fm_order.recipient_phone, "-", "") LIKE ?');
      expect(sql).toContain('OR REPLACE(fm_order.recipient_cellphone, "-", "") LIKE ?');

      // params 길이, 내용 검사
      expect(params.length).toBe(21);
      expect(params[0]).toEqual(dto.searchStartDate);
      expect(params[1]).toEqual(dto.searchEndDate);
      expect(params.slice(2, 21)).toEqual(new Array(19).fill(`%${dto.search}%`));
    });
  });

  it('search 필드만 주어진 경우', () => {
    const dto: FindFmOrdersDto = { search: 'test' };
    const { sql, params } = service['createFindOrdersQuery'](testGoodsIds, dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('GROUP_CONCAT(fm_order_item.goods_seq SEPARATOR');
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');
    expect(sql).toContain('WHERE fm_order_item.goods_seq IN (41)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('OR fm_order.order_seq LIKE ?');
    expect(sql).toContain('OR REPLACE(fm_order.order_phone, "-", "") LIKE ?');
    expect(sql).toContain('OR REPLACE(fm_order.order_cellphone, "-", "") LIKE ?');
    expect(sql).toContain('OR REPLACE(fm_order.recipient_phone, "-", "") LIKE ?');
    expect(sql).toContain('OR REPLACE(fm_order.recipient_cellphone, "-", "") LIKE ?');

    // params 길이, 내용 검사
    expect(params.length).toBe(19);
    expect(params).toEqual(new Array(19).fill(`%${dto.search}%`));
  });

  it('searchStartDate 만 주어진 경우', () => {
    const dto: FindFmOrdersDto = {
      searchDateType: '주문일',
      searchStartDate: '2021-08-24',
    };
    const { sql, params } = service['createFindOrdersQuery'](testGoodsIds, dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('GROUP_CONCAT(fm_order_item.goods_seq SEPARATOR');
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');
    expect(sql).toContain('WHERE fm_order_item.goods_seq IN (41)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('AND DATE(regist_date) >= ?');

    // params 길이, 내용 검사
    expect(params.length).toBe(1);
    expect(params).toEqual([dto.searchStartDate]);
  });

  it('searchEndDate 만 주어진 경우', () => {
    const dto: FindFmOrdersDto = {
      searchDateType: '주문일',
      searchEndDate: '2021-08-24',
    };
    const { sql, params } = service['createFindOrdersQuery'](testGoodsIds, dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('GROUP_CONCAT(fm_order_item.goods_seq SEPARATOR');
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');
    expect(sql).toContain('WHERE fm_order_item.goods_seq IN (41)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('AND DATE(regist_date) <= ?');

    // params 길이, 내용 검사
    expect(params.length).toBe(1);
    expect(params).toEqual([dto.searchEndDate]);
  });

  it('searchStatuses 만 주어진 경우', () => {
    const dto: FindFmOrdersDto = {
      searchStatuses: ['45', '55'],
    };
    const { sql, params } = service['createFindOrdersQuery'](testGoodsIds, dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('GROUP_CONCAT(fm_order_item.goods_seq SEPARATOR');
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');
    expect(sql).toContain('WHERE fm_order_item.goods_seq IN (41)');

    // where 구문이 올바르게 들어갔는 지 검사

    // params 길이, 내용 검사
    expect(params.length).toBe(0);
    expect(params).toEqual([]);
  });

  it('searchStatuses + searchStartDate', () => {
    const dto: FindFmOrdersDto = {
      searchEndDate: '2021-08-24',
      searchStatuses: ['45', '55'],
    };
    const { sql, params } = service['createFindOrdersQuery'](testGoodsIds, dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('GROUP_CONCAT(fm_order_item.goods_seq SEPARATOR');
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');
    expect(sql).toContain('WHERE fm_order_item.goods_seq IN (41)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('AND DATE(regist_date) <= ?');

    // params 길이, 내용 검사
    expect(params.length).toBe(1);
    expect(params).toEqual([dto.searchEndDate]);
  });

  describe('findOrders', () => {
    it('should be successed', async () => {
      const dto: FindFmOrdersDto = {
        search: 'test',
        searchDateType: '주문일',
        searchStartDate: '2020-08-23',
        searchEndDate: '2020-08-24',
        searchStatuses: ['25', '45', '55'],
      };

      // db.query를 mocking + spyon 하여 db.query 함수 요청 정보를 트래킹 + 실제 호출되지 않도록
      const querySpy = jest
        .spyOn(db, 'query')
        .mockImplementation(async () => ordersSample);

      await jest
        .spyOn(FmOrdersService.prototype as any, 'findOneOrderGiftFlag')
        .mockImplementation(() => null);

      const orders = await service.findOrders(testGoodsIds, dto);
      const { sql, params } = service['createFindOrdersQuery'](testGoodsIds, dto);

      expect(querySpy).toBeCalledWith(sql, params);

      expect(orders[0].goods_name).toEqual(ordersSample[0].goods_name);
      expect(orders[0].id).toEqual(ordersSample[0].id);
    });
  });

  describe('[PRIVATE Method] findOneOrderInfo', () => {
    const orderId = 'TESTORDERID';
    const goodsIds = [1, 2];

    it('should be return null', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async () => []);
      const orderDetail = await service['findOneOrderInfo'](orderId, goodsIds);

      expect(orderDetail).toEqual(null);
    });
  });

  describe('[PRIVATE Method] findOneOrderOptions', () => {
    const itemSeqArr = ['TEST_ITEM_SEQ'];

    it('should be successed', async () => {
      const querySpy = jest
        .spyOn(db, 'query')
        .mockImplementation(async () => orderDetailOptionsSample);
      const orderDetail = await service['findOneOrderOptions'](itemSeqArr);

      expect(orderDetail).toEqual(orderDetailOptionsSample);
    });

    it('should be return empty array', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async () => []);
      const orderDetail = await service['findOneOrderOptions'](itemSeqArr);

      expect(orderDetail).toEqual([]);
    });
  });

  describe('[PRIVATE Method] findOneOrderExports', () => {
    const orderId = 'TESTORDERID';
    const itemSeqArray = [1, 2];

    it('should be successed', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async (sql) => {
        const { itemOptions, ...rest } = orderDetailExportsSample[0];
        if (sql.includes('GROUP BY export_code')) {
          return [rest];
        }
        return itemOptions;
      });
      const orderDetail = await service['findOneOrderExports'](orderId, itemSeqArray);

      expect(orderDetail).toEqual(orderDetailExportsSample);
    });

    it('should be return empty array', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async () => []);
      const orderDetail = await service['findOneOrderExports'](orderId, itemSeqArray);

      expect(orderDetail).toEqual([]);
    });
  });

  describe('[PRIVATE Method] findOneOrderRefunds', () => {
    const orderId = 'TESTORDERID';

    it('should be successed', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async (sql) => {
        const { items, ...rest } = orderDetailRefundsSample[0];
        if (sql.includes('GROUP BY refund_code')) {
          return [rest];
        }
        return items;
      });
      const orderDetail = await service['findOneOrderRefunds'](orderId);

      expect(orderDetail).toEqual(orderDetailRefundsSample);
    });

    it('should be return empty array', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async () => []);
      const orderDetail = await service['findOneOrderRefunds'](orderId);

      expect(orderDetail).toEqual([]);
    });
  });

  describe('[PRIVATE Method] findOneOrderReturns', () => {
    const orderId = 'TESTORDERID';

    it('should be successed', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async (sql) => {
        const { items, ...rest } = orderDetailReturnsSample[0];
        if (sql.includes('GROUP BY')) {
          return [rest];
        }
        return items;
      });
      const orderDetail = await service['findOneOrderReturns'](orderId);

      expect(orderDetail).toEqual(orderDetailReturnsSample);
    });

    it('should be return empty array', async () => {
      const querySpy = jest.spyOn(db, 'query').mockImplementation(async () => []);
      const orderDetail = await service['findOneOrderReturns'](orderId);

      expect(orderDetail).toEqual([]);
    });
  });
});
