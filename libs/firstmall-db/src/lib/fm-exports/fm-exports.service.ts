import { Injectable } from '@nestjs/common';
import {
  ExportBundledOrdersDto,
  ExportOrderDto,
  ExportOrdersDto,
  FmExport,
  FmExportItem,
  FmExportRes,
  FmOrder,
  FmOrderOption,
  fmOrderStatuses,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { FirstmallDbService } from '../firstmall-db.service';
import { FMGoodsService } from '../fm-goods/fm-goods.service';
import { FmOrdersService } from '../fm-orders/fm-orders.service';

interface DbQueryParams {
  sql: string;
  sqlParams: any[];
}

type OrderAndOrderItemOptionExportStatuses = '55' | '50';
type ExportStatus = '55';
type ExportQueries = {
  goodsExport: DbQueryParams;
  exportOptionsQueries: {
    exportGoodsItems: DbQueryParams;
    changeOrderItemEa: DbQueryParams;
    changeOrderItemEa2: DbQueryParams;
    reduceGoodsStock: DbQueryParams;
    orderItemStatusChange: DbQueryParams;
  }[];
  orderStatusChange: DbQueryParams;
  orderExportLog: DbQueryParams;
};

@Injectable()
export class FmExportsService {
  private EXPORT_TABLE = 'fm_goods_export';
  constructor(
    private readonly db: FirstmallDbService,
    private readonly fmGoodsService: FMGoodsService,
    private readonly fmOrdersService: FmOrdersService,
  ) {}

  /**
   * 출고번호를 기반으로 특정 출고정보를 찾습니다.
   * @param exportCode 출고번호
   * @returns 출고정보
   */
  public async findOne(exportCode: string): Promise<FmExportRes> {
    const findOneSql = `
    SELECT fm_goods_export.*,
      IF(
        fm_goods_export.shipping_date = "0000-00-00",
          null,
          fm_goods_export.shipping_date
        ) as shipping_date,
      recipient_user_name,
      recipient_phone,
      recipient_cellphone,
      recipient_zipcode,
      recipient_address,
      recipient_address_street,
      recipient_address_detail,
      recipient_email,
      order_user_name,
      order_phone,
      order_cellphone,
      order_email
    FROM fm_goods_export
    JOIN fm_order USING(order_seq)
    WHERE export_code = ?`;
    const res: FmExport[] = await this.db.query(findOneSql, [exportCode]);
    if (res.length === 0) return null;
    const _export = res[0];

    const findItemsSql = `
    SELECT 
      goods_name, image,
      item_option_seq, title1, option1, color, fm_goods_export_item.ea, price, step,
      fm_order_item.order_seq
    FROM fm_order_item_option
      JOIN fm_order_item USING(item_seq)
    JOIN fm_goods_export_item ON item_option_seq = option_seq
    WHERE export_code = ?`;
    const items: FmExportItem[] = await this.db.query(findItemsSql, [exportCode]);

    return { ..._export, items };
  }

  /** 단일 주문 출고 처리 진행 */
  public async exportOrder(
    dto: ExportOrderDto,
    actor: string,
    index?: number, // 다중 일괄 출고처리시 중복되지 않는 출고코드 생성을 위한 인덱스값
  ): Promise<{ orderId: string; exportCode: string }> {
    // 출고 코드 생성
    const exportCode = await this.generateExportCode(index || undefined);

    const { exportOptionsQueries, goodsExport, orderExportLog, orderStatusChange } =
      await this.createExportOrderQueries(dto, actor, exportCode);

    if (!exportOptionsQueries) return null;

    return this.db.transactionQuery(async (conn) => {
      // * 실물 출고 처리
      await conn.query(goodsExport.sql, goodsExport.sqlParams);
      // * 상품(옵션)벌 변경 필요 사항
      await Promise.all(
        exportOptionsQueries.map((q) => {
          if (!q) return null;
          const {
            exportGoodsItems,
            changeOrderItemEa,
            changeOrderItemEa2,
            reduceGoodsStock,
            orderItemStatusChange,
          } = q;
          return Promise.all([
            conn.query(exportGoodsItems.sql, exportGoodsItems.sqlParams),
            conn.query(changeOrderItemEa.sql, changeOrderItemEa.sqlParams),
            conn.query(changeOrderItemEa2.sql, changeOrderItemEa2.sqlParams),
            conn.query(reduceGoodsStock.sql, reduceGoodsStock.sqlParams),
            conn.query(orderItemStatusChange.sql, orderItemStatusChange.sqlParams),
          ]);
        }),
      );
      // * 주문 상태 변경
      await conn.query(orderStatusChange.sql, orderStatusChange.sqlParams);
      // * 출고 처리 주문 로그 생성
      await conn.query(orderExportLog.sql, orderExportLog.sqlParams);
      await conn.commit();
      return { orderId: dto.orderId, exportCode };
    });
  }

  /** 일괄 출고 처리 진행 */
  public async exportOrders(dto: ExportOrdersDto, actor: string): Promise<boolean> {
    const res = await Promise.all(
      dto.exportOrders.map((eo, index) => this.exportOrder(eo, actor, index)),
    );
    return res.every((exportCode) => !!exportCode);
  }

  /** 일괄 합포장 처리 진행 */
  public async exportBundledOrders(
    dto: ExportBundledOrdersDto,
    actor: string,
  ): Promise<boolean> {
    // * 일괄 출고 처리
    const exportInfos = await Promise.all(
      dto.exportOrders.map((eo) => this.exportOrder(eo, actor)),
    );

    const bundleCode = await this.generateBundleCode();

    const exportQueries = exportInfos.map((ei) => {
      return this.createExportBundleQueries({
        orderId: ei.orderId,
        exportCode: ei.exportCode,
        bundleCode,
      });
    });

    // * 일괄 출고 처리된 출고를 합포장으로 변경 처리
    const res = await this.db.transactionQuery(async (conn) => {
      const r = await Promise.all(
        exportQueries.map((eq) => {
          return eq.map(({ sql, sqlParams }) =>
            conn.query(sql, sqlParams).then(() => true),
          );
        }),
      );

      await conn.commit();
      return r;
    });

    return res.every((arr) => arr.every((x) => !!x));
  }

  // * ******************************************
  // * 쿼리 생성 함수
  // * ******************************************
  private async createExportOrderQueries(
    orderExportInfo: ExportOrderDto,
    actor: string,
    exportCode: string,
  ): Promise<ExportQueries> {
    const { orderId, deliveryCompanyCode, deliveryNumber, exportOptions } =
      orderExportInfo;

    const targetStatus = '55';
    // 주문 정보 조회
    const orderInfo = await this.fmOrdersService.findOneOrder(orderId);
    if (!orderInfo) return null;

    // 실물 출고 처리 쿼리 생성
    const today = new Date();
    const goodsExport = this.createGoodsExportQuery({
      export_code: exportCode,
      status: targetStatus, // 출고완료
      delivery_company_code: deliveryCompanyCode, // 택배사 코드
      delivery_number: deliveryNumber, // 송장번호
      order_seq: orderId,
      domestic_shipping_method: orderInfo.shipping_method,
      status_date: today,
      export_date: today,
      complete_date: today,
      regist_date: today,
      shipping_provider_seq: 1, // fm_provider.provider_seq
      shipping_group: orderInfo.shipping_group,
      shipping_method: orderInfo.shipping_method,
      shipping_set_name: orderInfo.shipping_set_name,
    });

    const goodsSeqArr = orderInfo.items.map((i) => i.goods_seq);
    // 재고 차감 처리를 위한 상품옵션 정보 찾기
    const goodsOptions = await this.fmGoodsService.findGoodsOptions(goodsSeqArr);

    let targetOrderStatus: OrderAndOrderItemOptionExportStatuses = targetStatus;
    // * 상품(옵션)벌 변경 필요 사항
    const exportOptionsQueries = exportOptions.map((opt) => {
      // * 해당 상품(옵션)의 보낸 수량 없는 경우, 건너 뜀
      if (!opt.exportEa || opt.exportEa === 0) {
        return null;
      }

      // * 주문상품(옵션) 출고 내역 생성
      const exportGoodsItems = this.createGoodsItemsExportQuery({
        export_code: exportCode,
        item_seq: opt.itemSeq,
        option_seq: opt.itemOptionSeq,
        ea: opt.exportEa,
      });

      // * 주문상품(옵션) 상태별 수량변경 쿼리
      const changeOrderItemEa = this.createChangeOrderItemEaQuery2({
        targetStatus,
        ea: opt.exportEa,
        itemOptionSeq: opt.itemOptionSeq,
      });

      const changeOrderItemEa2 = this.createChangeOrderItemEaQuery3(opt.itemOptionSeq);

      // * 주문상품(옵션) 상태별 재고 차감 처리 (출고완료시에만 )
      const goodsOption = goodsOptions.find((_o) => {
        return _o.option1 === opt.option1 && _o.option_title === opt.optionTitle;
      });
      const reduceGoodsStock = this.createReduceOrderItemGoodsStockQuery(
        goodsOption.option_seq,
        opt.exportEa,
      );

      // * 주문상품(옵션) 상태 변경 쿼리
      // 현재 출고하고자 하는 옵션의 전체 정보를 가져옴.
      let opts: FmOrderOption[] = [];
      orderInfo.items.forEach((i) => {
        opts = opts.concat(i.options);
      });

      // 현재 옵션을 찾음
      const realOrderItemOption = opts.find(
        (__o) => __o.item_option_seq === opt.itemOptionSeq,
      );
      // 출고 타겟 상태 (모든 주문수량 만큼 출고하지 않으면, 부분 출고 상태로 변경)
      let exportTargetStatus: OrderAndOrderItemOptionExportStatuses = targetStatus;
      if (!(opt.exportEa >= realOrderItemOption.ea)) {
        // 주문상품옵션의 상태를 부분 출고 상태로 설정
        exportTargetStatus = String(
          Number(targetStatus) - 5,
        ) as OrderAndOrderItemOptionExportStatuses;
        // 주문의 상태도 부분 출고 상태로 설정
        targetOrderStatus = exportTargetStatus;
      }
      const orderItemStatusChange = this.createChangeOrderItemStatusQuery(
        exportTargetStatus,
        opt.itemOptionSeq,
      );

      return {
        exportGoodsItems,
        changeOrderItemEa,
        changeOrderItemEa2,
        reduceGoodsStock,
        orderItemStatusChange,
      };
    });

    // * 주문 상태 쿼리 변경
    const orderStatusChange = this.createChangeOrderStatusQuery(
      targetOrderStatus,
      orderId,
    );

    // * 출고 처리 주문 로그 쿼리 생성
    const orderExportLog = this.createOrderExportLogQuery({
      exportCode,
      orderSeq: orderInfo.order_seq,
      registDate: new Date(),
      title: `${fmOrderStatuses[targetStatus].name}(${exportCode})`,
      actor,
    });

    // 각 쿼리 반환
    return {
      goodsExport,
      exportOptionsQueries,
      orderStatusChange,
      orderExportLog,
    };
  }

  /**
   * 출고 처리시 fm_goods_export 엔터티를 생성하는 쿼리와 쿼리변수를 반환
   */
  private createGoodsExportQuery(params: {
    export_code: string;
    status?: ExportStatus;
    order_seq: number | string;
    domestic_shipping_method: string;
    delivery_company_code: string;
    delivery_number: string;
    status_date: Date | string;
    export_date: Date | string;
    complete_date?: Date | string;
    regist_date: Date | string;
    shipping_provider_seq: number;
    shipping_group: string;
    shipping_method: string;
    shipping_set_name: string;
  }): DbQueryParams {
    return {
      sql: `
      INSERT INTO fm_goods_export
      (
        export_code, status, order_seq,
        domestic_shipping_method, delivery_company_code, delivery_number,
        status_date, export_date, complete_date, regist_date,
        shipping_provider_seq,
        shipping_group, shipping_method, shipping_set_name
      ) VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?,
        ?, ?, ?
      )`,
      sqlParams: [
        params.export_code,
        params.status || '45',
        params.order_seq,
        params.domestic_shipping_method,
        params.delivery_company_code,
        params.delivery_number,
        params.status_date,
        params.export_date,
        params.complete_date || null,
        params.regist_date,
        params.shipping_provider_seq,
        params.shipping_group,
        params.shipping_method,
        params.shipping_set_name,
      ],
    };
  }

  /**
   * 출고 처리시 fm_goods_export_item 엔터티를 생성하는 쿼리와 쿼리변수를 반환
   */
  private createGoodsItemsExportQuery({
    export_code,
    item_seq,
    option_seq,
    ea,
    bundle_export_code = '',
  }: {
    export_code: string;
    item_seq: number | string;
    option_seq: number | string;
    ea: number;
    bundle_export_code?: string;
  }): DbQueryParams {
    return {
      sql: `INSERT INTO fm_goods_export_item
      (export_code, item_seq, option_seq, ea, bundle_export_code) VALUES (
        ?, ?, ?, ?, ?
      )`,
      sqlParams: [export_code, item_seq, option_seq, ea, bundle_export_code],
    };
  }

  /**
   * 출고 처리시 각 주문 상품(옵션)의 상태별 수량을 변경하는 쿼리와 쿼리변수를 반환
   * 연관 테이블 fm_order_item_option
   * */
  private createChangeOrderItemEaQuery2(params: {
    targetStatus: ExportStatus;
    ea: number;
    itemOptionSeq: FmOrderOption['item_option_seq'];
  }): DbQueryParams {
    return {
      sql: `
      UPDATE fm_order_item_option
      SET step${params.targetStatus} = step${params.targetStatus} + ?
      WHERE item_option_seq = ?`,
      sqlParams: [params.ea, params.itemOptionSeq],
    };
  }

  /**
   * 출고 처리시 각 주문 상품(옵션)의 상품준비 수량 차감 쿼리와 쿼리변수를 반환
   * 연관 테이블 fm_order_item_option
   * */
  private createChangeOrderItemEaQuery3(
    itemOptionSeq: FmOrderOption['item_option_seq'],
  ): DbQueryParams {
    return {
      sql: `UPDATE fm_order_item_option
    SET step35 = IFNULL(ea,0) - (
      IFNULL(step85,0) + IFNULL(step45,0) +
      IFNULL(step55,0) + IFNULL(step65,0) + IFNULL(step75,0)
    ) WHERE item_option_seq = ?`,
      sqlParams: [itemOptionSeq],
    };
  }

  /**
   * 출고 처리시 각 주문 상품(옵션)의 재고 차감 쿼리와 쿼리변수를 반환
   * 연관 테이블 fm_goods_supply
   */
  private createReduceOrderItemGoodsStockQuery(
    optionSeq: number | string,
    ea: number,
  ): DbQueryParams {
    return {
      sql: `UPDATE fm_goods_supply SET
      stock = stock - IF(stock >= ?, ?, stock),
      reservation15 = reservation15 - ?,
      reservation25 = reservation25 - ?
      WHERE option_seq = ?
      `,
      sqlParams: [ea, ea, ea, ea, optionSeq],
    };
  }

  /**
   * 출고 처리시 주문 상태 변경 쿼리와 쿼리변수를 반환
   */
  private createChangeOrderStatusQuery(
    exportTargetStatus: OrderAndOrderItemOptionExportStatuses,
    orderId: FmOrder['order_seq'] | string,
  ): DbQueryParams {
    return {
      sql: `UPDATE fm_order SET step = ? WHERE order_seq = ?`,
      sqlParams: [exportTargetStatus, orderId],
    };
  }

  /**
   * 출고 처리시 주문 상품(옵션)별 상태 변경 쿼리와 쿼리변수를 반환
   */
  private createChangeOrderItemStatusQuery(
    exportTargetStatus: OrderAndOrderItemOptionExportStatuses,
    itemOptionSeq: FmOrderOption['item_option_seq'] | string,
  ): DbQueryParams {
    return {
      sql: `UPDATE fm_order_item_option SET step = ? WHERE item_option_seq = ?`,
      sqlParams: [exportTargetStatus, itemOptionSeq],
    };
  }

  /**
   * 출고 처리 주문 로그 쿼리와 쿼리변수를 반환
   */
  private createOrderExportLogQuery({
    orderSeq,
    exportCode,
    actor,
    title,
    registDate,
  }: {
    orderSeq: string | number;
    exportCode: string;
    actor: string;
    title: string;
    registDate: Date;
  }): DbQueryParams {
    return {
      sql: `INSERT fm_order_log (
        order_seq, export_code, type, actor, mtype,
        title, regist_date
      ) VALUES (
        ?, ?, "export", ?, "p",
        ?, ?
      )
      `,
      sqlParams: [orderSeq, exportCode, actor, title, registDate],
    };
  }

  /**
   * 출고 처리 항목을 합포장(묶음배송)처리 쿼리 생성
   */
  private createExportBundleQueries({
    orderId,
    exportCode,
    bundleCode,
  }: {
    orderId: string;
    exportCode: string;
    bundleCode: string;
  }): DbQueryParams[] {
    return [
      // 주문 합포장 처리 (각 주문의 fm_order.bundle_yn -> y)
      {
        sql: `UPDATE fm_order SET bundle_yn = "y" WHERE order_seq = ?`,
        sqlParams: [orderId],
      },
      // 각 출고 생성 (fm_goods_export), 각 출고에 번들아이디 할당 (fm_goods_export.bundle_export_code)
      {
        sql: `UPDATE fm_goods_export SET bundle_export_code = ? WHERE export_code = ?`,
        sqlParams: [bundleCode, exportCode],
      },
      // 각 출고 항목 생성 (fm_goods_export_item), 각 출고의 각 출고 항목에 벌들아이디 할당 (fm_goods_export_item.bundle_export_code)
      {
        sql: `UPDATE fm_goods_export_item SET bundle_export_code = ? WHERE export_code = ?`,
        sqlParams: [bundleCode, exportCode],
      },
      // 각 주문 로그 처리 (fm_order_log, title에 "출고완료(번들아이디)"와 같이 작성)
      {
        sql: `UPDATE fm_order_log SET title = ? WHERE export_code = ?`,
        sqlParams: [`출고완료(${bundleCode})`, exportCode],
      },
    ];
  }

  /**
   * 출고 코드를 생성합니다.
   * 출고 코드 예) D210826122
   * @param exportIndex {number} 일괄처리의 경우 동일한 export_code가 생성될 우려가 있어, exportIndex만큼 exportCode에 더한 값을 반환하기 위한 인덱스값.
   * @returns 생성된 출고 코드
   */
  private async generateExportCode(exportIndex?: number): Promise<string> {
    const PREFIX = 'D';
    const now = dayjs().format('YYMMDDH');
    const res = await this.db.query(
      `SELECT export_seq FROM ${this.EXPORT_TABLE} ORDER BY export_seq DESC LIMIT 1`,
    );
    if (res.length === 0) return `${PREFIX + now}1`;
    if (res.length > 0) {
      const { export_seq } = res[0];
      const newId = Number(export_seq) + 1 + (exportIndex || 0);
      return PREFIX + now + newId;
    }
    return `${PREFIX + now}1`;
  }

  /**
   * 합포장 코드를 생성합니다.
   * 출고 코드 예) D210826122
   * @returns 생성된 출고 코드
   */
  private async generateBundleCode(): Promise<string> {
    const PREFIX = 'B';
    const now = dayjs().format('YYMMDDH');
    const res = await this.db.query(
      `SELECT export_seq FROM ${this.EXPORT_TABLE} ORDER BY export_seq DESC LIMIT 1`,
    );
    if (res.length === 0) return `${PREFIX + now}1`;
    if (res.length > 0) {
      const { export_seq } = res[0];
      const newId = Number(export_seq) + 1;
      return PREFIX + now + newId;
    }
    return `${PREFIX + now}1`;
  }
}
