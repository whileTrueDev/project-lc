/* eslint-disable dot-notation */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { FindFmOrdersDto } from '@project-lc/shared-types';
import { ordersSample } from '../../__tests__/ordersSample';
import { FirstmallDbService } from '../firstmall-db.service';
import { FmOrdersService } from './fm-orders.service';

describe('FmOrdersService', () => {
  let service: FmOrdersService;
  let db: FirstmallDbService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FmOrdersService, FirstmallDbService],
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
        searchStatuses: ['45', '55'],
      };
      const { sql, params } = service['createFindOrdersQuery'](dto);

      // 기본 select 구문이 올바르게 들어갔는 지 검사
      expect(sql).toContain(
        'SELECT fm_order_item.goods_name, fm_order.order_seq as id, fm_order.*',
      );
      expect(sql).toContain('FROM fm_order');
      expect(sql).toContain('JOIN fm_order_item USING(order_seq)');

      // where 구문이 올바르게 들어갔는 지 검사
      expect(sql).toContain('WHERE regist_date >= ? AND regist_date <= ?');
      expect(sql).toContain('OR fm_order.order_seq LIKE ?');

      // params 길이, 내용 검사
      expect(params.length).toBe(15);
      expect(params[0]).toEqual(dto.searchStartDate);
      expect(params[1]).toEqual(dto.searchEndDate);
      expect(params.slice(2, 15)).toEqual(new Array(13).fill(`%${dto.search}%`));
    });
  });

  it('search 필드만 주어진 경우', () => {
    const dto: FindFmOrdersDto = { search: 'test' };
    const { sql, params } = service['createFindOrdersQuery'](dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain(
      'SELECT fm_order_item.goods_name, fm_order.order_seq as id, fm_order.*',
    );
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('OR order_seq LIKE ?');

    // params 길이, 내용 검사
    expect(params.length).toBe(13);
    expect(params).toEqual(new Array(13).fill(`%${dto.search}%`));
  });

  it('searchStartDate 만 주어진 경우', () => {
    const dto: FindFmOrdersDto = {
      searchDateType: '주문일',
      searchStartDate: '2021-08-24',
    };
    const { sql, params } = service['createFindOrdersQuery'](dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain(
      'SELECT fm_order_item.goods_name, fm_order.order_seq as id, fm_order.*',
    );
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('WHERE regist_date >= ?');

    // params 길이, 내용 검사
    expect(params.length).toBe(1);
    expect(params).toEqual([dto.searchStartDate]);
  });

  it('searchEndDate 만 주어진 경우', () => {
    const dto: FindFmOrdersDto = {
      searchDateType: '주문일',
      searchEndDate: '2021-08-24',
    };
    const { sql, params } = service['createFindOrdersQuery'](dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain(
      'SELECT fm_order_item.goods_name, fm_order.order_seq as id, fm_order.*',
    );
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('WHERE regist_date <= ?');

    // params 길이, 내용 검사
    expect(params.length).toBe(1);
    expect(params).toEqual([dto.searchEndDate]);
  });

  it('searchStatuses 만 주어진 경우', () => {
    const dto: FindFmOrdersDto = {
      searchStatuses: ['45', '55'],
    };
    const { sql, params } = service['createFindOrdersQuery'](dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain(
      'SELECT fm_order_item.goods_name, fm_order.order_seq as id, fm_order.*',
    );
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('WHERE step IN (');

    // params 길이, 내용 검사
    expect(params.length).toBe(0);
    expect(params).toEqual([]);
  });

  it('searchStatuses + searchStartDate', () => {
    const dto: FindFmOrdersDto = {
      searchEndDate: '2021-08-24',
      searchStatuses: ['45', '55'],
    };
    const { sql, params } = service['createFindOrdersQuery'](dto);

    // 기본 select 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain(
      'SELECT fm_order_item.goods_name, fm_order.order_seq as id, fm_order.*',
    );
    expect(sql).toContain('FROM fm_order');
    expect(sql).toContain('JOIN fm_order_item USING(order_seq)');

    // where 구문이 올바르게 들어갔는 지 검사
    expect(sql).toContain('WHERE regist_date <= ?');
    expect(sql).toContain('AND step IN (');

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
        searchStatuses: ['45', '55'],
      };

      // db.query를 mocking + spyon 하여 db.query 함수 요청 정보를 트래킹 + 실제 호출되지 않도록
      const querySpy = jest
        .spyOn(db, 'query')
        .mockImplementation(async () => ordersSample);

      const orders = await service.findOrders(dto);
      const { sql, params } = service['createFindOrdersQuery'](dto);
      expect(querySpy).toBeCalledTimes(1);
      expect(querySpy).toBeCalledWith(sql, params);

      expect(orders[0].goods_name).toEqual(ordersSample[0].goods_name);
      expect(orders[0].id).toEqual(ordersSample[0].id);
    });
  });
});
