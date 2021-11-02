/* eslint-disable dot-notation */
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GoodsModule } from '@project-lc/nest-modules';
import { PrismaModule } from '@project-lc/prisma-orm';
import { exportItemSample, exportSample } from '../../__tests__/exportSample';
import { FirstmallDbService } from '../firstmall-db.service';
import { FMGoodsService } from '../fm-goods/fm-goods.service';
import { FmOrdersService } from '../fm-orders/fm-orders.service';
import { FmExportsService } from './fm-exports.service';

describe('FmExportsService', () => {
  let service: FmExportsService;
  let db: FirstmallDbService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GoodsModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [FmExportsService, FirstmallDbService, FMGoodsService, FmOrdersService],
    }).compile();

    service = module.get<FmExportsService>(FmExportsService);
    db = module.get<FirstmallDbService>(FirstmallDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateExportCode', () => {
    it('should return string', async () => {
      jest.spyOn(db, 'query').mockImplementation(async () => []);
      const code = await service['generateExportCode']();
      expect(typeof code).toEqual('string');
      expect(code).toContain('D');
    });
  });

  describe('generateBundleCode', () => {
    it('should return string', async () => {
      jest.spyOn(db, 'query').mockImplementation(async () => []);
      const code = await service['generateBundleCode']();
      expect(typeof code).toEqual('string');
      expect(code).toContain('B');
    });
  });

  describe('createGoodsExportQuery', () => {
    it('return sql and sqlParams', () => {
      const params = {
        export_code: 'D12345',
        status: '55' as const,
        order_seq: '1',
        domestic_shipping_method: '1',
        delivery_company_code: '1',
        delivery_number: '1',
        status_date: '1',
        export_date: '1',
        complete_date: '1',
        regist_date: '1',
        shipping_provider_seq: 1,
        shipping_group: '1',
        shipping_method: '1',
        shipping_set_name: '1',
      };
      const res = service['createGoodsExportQuery'](params);
      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain('INSERT INTO fm_goods_export');
      expect(res.sql).toContain('VALUES');

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams[0]).toContain('D12345');
      expect(res.sqlParams[1]).toContain('55');
      expect(res.sqlParams).toEqual([
        params.export_code,
        params.status,
        params.order_seq,
        params.domestic_shipping_method,
        params.delivery_company_code,
        params.delivery_number,
        params.status_date,
        params.export_date,
        params.complete_date,
        params.regist_date,
        params.shipping_provider_seq,
        params.shipping_group,
        params.shipping_method,
        params.shipping_set_name,
      ]);
    });
  });

  describe('createGoodsItemsExportQuery', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createGoodsItemsExportQuery']>[0] = {
        ea: 1,
        export_code: 'D12345',
        item_seq: 1,
        option_seq: 1,
        bundle_export_code: 'B12345',
      };

      const res = service['createGoodsItemsExportQuery'](params);

      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain('INSERT INTO fm_goods_export_item');
      expect(res.sql).toContain('VALUES');

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams).toEqual([
        params.export_code,
        params.item_seq,
        params.option_seq,
        params.ea,
        params.bundle_export_code,
      ]);
    });
  });

  describe('createChangeOrderItemEaQuery2', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createChangeOrderItemEaQuery2']>[0] = {
        ea: 1,
        itemOptionSeq: 1,
        targetStatus: '55',
      };

      const res = service['createChangeOrderItemEaQuery2'](params);

      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain('UPDATE fm_order_item_option');
      expect(res.sql).toContain(
        `step${params.targetStatus} = step${params.targetStatus} + ?`,
      );

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams).toEqual([params.ea, params.itemOptionSeq]);
    });
  });

  describe('createChangeOrderItemEaQuery3', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createChangeOrderItemEaQuery3']>[0] = 1;

      const res = service['createChangeOrderItemEaQuery3'](params);

      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain('UPDATE fm_order_item_option');
      expect(res.sql).toContain(`SET step35 = IFNULL(ea,0) -`);
      expect(res.sql).toContain(`IFNULL(step85,0) + IFNULL(step45,0) +`);
      expect(res.sql).toContain(`IFNULL(step55,0) + IFNULL(step65,0) + IFNULL(step75,0)`);

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams).toEqual([params]);
    });
  });

  describe('createReduceOrderItemGoodsStockQuery', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createReduceOrderItemGoodsStockQuery']> = [
        1, 2,
      ];

      const res = service['createReduceOrderItemGoodsStockQuery'](...params);

      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain('UPDATE fm_goods_supply SET');
      expect(res.sql).toContain(`stock = stock - IF(stock >= ?, ?, stock),`);
      expect(res.sql).toContain(`reservation15 = reservation15 - ?,`);
      expect(res.sql).toContain(`reservation25 = reservation25 - ?`);

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams).toEqual([
        params[1],
        params[1],
        params[1],
        params[1],
        params[0],
      ]);
    });
  });

  describe('createChangeOrderStatusQuery', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createChangeOrderStatusQuery']> = [
        '55',
        1,
      ];

      const res = service['createChangeOrderStatusQuery'](...params);

      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain('UPDATE fm_order SET step = ? WHERE order_seq = ?');

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams).toEqual([params[0], params[1]]);
    });
  });

  describe('createChangeOrderItemStatusQuery', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createChangeOrderItemStatusQuery']> = [
        '55',
        1,
      ];

      const res = service['createChangeOrderItemStatusQuery'](...params);

      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain(
        'UPDATE fm_order_item_option SET step = ? WHERE item_option_seq = ?',
      );

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams).toEqual([params[0], params[1]]);
    });
  });

  describe('createOrderExportLogQuery', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createOrderExportLogQuery']>[0] = {
        actor: 'test@test.com',
        exportCode: 'D12345',
        orderSeq: 1,
        registDate: new Date(),
        title: 'title',
      };

      const res = service['createOrderExportLogQuery'](params);

      expect(res.sql).toBeDefined();
      expect(res.sqlParams).toBeDefined();

      expect(res.sql).toContain('INSERT fm_order_log');
      expect(res.sql).toContain('VALUES');

      expect(res.sqlParams).toBeInstanceOf(Array);
      expect(res.sqlParams).toEqual([
        params.orderSeq,
        params.exportCode,
        params.actor,
        params.title,
        params.registDate,
      ]);
    });
  });

  describe('createExportBundleQueries', () => {
    it('return sql and sqlParams', () => {
      const params: Parameters<typeof service['createExportBundleQueries']>[0] = {
        orderId: '1',
        bundleCode: 'B12345',
        exportCode: 'D12345',
      };

      const res = service['createExportBundleQueries'](params);

      // 주문 합포장 처리 (각 주문의 fm_order.bundle_yn -> y)
      expect(res[0].sql).toBeDefined();
      expect(res[0].sql).toContain(
        'UPDATE fm_order SET bundle_yn = "y" WHERE order_seq = ?',
      );
      expect(res[0].sqlParams).toBeDefined();
      expect(res[0].sqlParams).toBeInstanceOf(Array);
      expect(res[0].sqlParams).toEqual([params.orderId]);

      // 각 출고 생성 (fm_goods_export), 각 출고에 번들아이디 할당 (fm_goods_export.bundle_export_code)
      expect(res[1].sql).toBeDefined();
      expect(res[1].sql).toContain(
        'UPDATE fm_goods_export SET bundle_export_code = ? WHERE export_code = ?',
      );
      expect(res[1].sqlParams).toBeDefined();
      expect(res[1].sqlParams).toBeInstanceOf(Array);
      expect(res[1].sqlParams).toEqual([params.bundleCode, params.exportCode]);

      // 각 출고 항목 생성 (fm_goods_export_item), 각 출고의 각 출고 항목에 벌들아이디 할당 (fm_goods_export_item.bundle_export_code)
      expect(res[2].sql).toBeDefined();
      expect(res[2].sql).toContain(
        'UPDATE fm_goods_export_item SET bundle_export_code = ? WHERE export_code = ?',
      );
      expect(res[2].sqlParams).toBeDefined();
      expect(res[2].sqlParams).toBeInstanceOf(Array);
      expect(res[2].sqlParams).toEqual([params.bundleCode, params.exportCode]);

      // 각 주문 로그 처리 (fm_order_log, title에 "출고완료(번들아이디)"와 같이 작성)
      expect(res[3].sql).toBeDefined();
      expect(res[3].sql).toContain(
        'UPDATE fm_order_log SET title = ? WHERE export_code = ?',
      );
      expect(res[3].sqlParams).toBeDefined();
      expect(res[3].sqlParams).toBeInstanceOf(Array);
      expect(res[3].sqlParams).toEqual([
        `출고완료(${params.bundleCode})`,
        params.exportCode,
      ]);
    });
  });

  describe('findOne', () => {
    it('return export information with exported order items', async () => {
      jest.spyOn(db, 'query').mockImplementation(async (sql) => {
        if (sql.includes('fm_goods_export.*,')) {
          return [exportSample];
        }
        return exportItemSample;
      });

      const exportData = await service.findOne('D123456');

      expect(exportData).toEqual({
        ...exportSample,
        items: exportItemSample,
      });
    });
  });
});
