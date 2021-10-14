import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FindFmOrderDetailRes,
  FindFmOrderRes,
  FindFmOrdersDto,
  FmOrder,
  FmOrderExport,
  FmOrderExportBase,
  FmOrderExportItemOption,
  FmOrderItem,
  FmOrderMetaInfo,
  FmOrderOption,
  FmOrderRefund,
  FmOrderRefundItem,
  FmOrderReturn,
  FmOrderReturnBase,
  FmOrderReturnItem,
  FmOrderStatusNumString,
} from '@project-lc/shared-types';
import { FmOrderMemoParser } from '@project-lc/utils';
import dayjs from 'dayjs';
import { FirstmallDbService } from '../firstmall-db.service';

function statCounter(): any {
  const stats = {
    배송준비중: 0,
    배송중: 0,
    배송완료: 0,
  };

  const sales = {
    주문: {
      count: 0,
      sum: 0,
    },
    환불: {
      count: 0,
      sum: 0,
    },
  };

  const exDay = dayjs().subtract(1, 'day');

  // fm_order 테이블의 주문 상태를 통해
  function getStatKey(step: FmOrderStatusNumString): string | null {
    const stepNum = parseInt(step, 10);
    if (stepNum >= 35 && stepNum <= 50) {
      return '배송준비중';
    }
    if (stepNum >= 55 && stepNum <= 70) {
      return '배송중';
    }
    if (stepNum === 75) {
      return '배송완료';
    }
    return null;
  }

  function getSalesKey(step: FmOrderStatusNumString, regist_date: string): string | null {
    const stepNum = parseInt(step, 10);
    if (exDay.isBefore(dayjs(regist_date))) {
      if (stepNum >= 35 && stepNum <= 75) {
        return '주문';
      }
      if (stepNum === 85) {
        return '환불';
      }
    }
    return null;
  }

  function count(
    step: FmOrderStatusNumString,
    regist_date: string,
    payment_price: number,
  ): void {
    const key = getStatKey(step);
    if (key) {
      stats[key] += 1;
    }

    const salesKey = getSalesKey(step, regist_date);
    if (salesKey) {
      sales[key].count += 1;
      sales[key].sum += payment_price;
    }
  }

  return {
    count,
    stats,
    sales,
  };
}

@Injectable()
export class FmOrdersService {
  constructor(private readonly db: FirstmallDbService) {}

  // * **********************************
  // * 주문 목록 조회
  // * **********************************
  /**
   * 상품 ID목록과 검색 및 필터링 정보를 통해 퍼스트몰의 주문 목록을 조회
   * @returns {FindFmOrderRes[]}
   * @author hwasurr
   */
  public async findOrders(
    goodsIds: number[],
    dto: FindFmOrdersDto,
  ): Promise<FindFmOrderRes[]> {
    const { sql, params } = this.createFindOrdersQuery(goodsIds, dto);
    if (!sql) return [];
    const data = (await this.db.query(sql, params)) as FindFmOrderRes[];
    return data.map((x) => ({ ...x }));
  }

  /**
   * 상품 목록 조회 쿼리와 쿼리변수를 생성합니다.
   * @param goodsIds 찾을 주문에 속한 상품 Id 배열
   * @param dto 검색 및 필터링 정보
   */
  private createFindOrdersQuery(
    goodsIds: number[],
    dto: FindFmOrdersDto,
  ): {
    sql: string;
    params: any[];
  } {
    const defaultQueryHead = `
    SELECT
      IF(
        COUNT(fm_order_item.goods_name) >= 2,
          CONCAT(goods_name, " 외 ", COUNT(fm_order_item.goods_name) - 1),
          goods_name) goods_name,
      fm_order.order_seq as id,
      fm_order.*
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    WHERE fm_order_item.goods_seq IN (${goodsIds.join(',')})
    `;

    const searchSql = `goods_name LIKE ?
      OR order_seq LIKE ?
      OR fm_order.order_seq LIKE ?
      OR fm_order.recipient_user_name LIKE ?
      OR fm_order.depositor LIKE ?
      OR fm_order.recipient_cellphone LIKE ?
      OR fm_order.recipient_phone LIKE ?
      OR fm_order.order_email LIKE ?
      OR fm_order.recipient_user_name LIKE ?
      OR fm_order_item.goods_name LIKE ?
      OR fm_order_item.item_seq LIKE ?
      OR fm_order.order_cellphone LIKE ?
      OR REPLACE(fm_order.order_cellphone, "-", "") LIKE ?
      OR fm_order.order_phone LIKE ?
      OR REPLACE(fm_order.order_phone, "-", "") LIKE ?
      OR fm_order.recipient_cellphone LIKE ?
      OR REPLACE(fm_order.recipient_cellphone, "-", "") LIKE ?
      OR fm_order.recipient_phone LIKE ?
      OR REPLACE(fm_order.recipient_phone, "-", "") LIKE ?
      `;

    let whereSql = '';
    let orderSql = '';
    const groupbySql = '    GROUP BY order_seq';
    let params = [];

    if (dto.searchStartDate || dto.searchEndDate) {
      let targetCol = 'regist_date';
      orderSql = `\nORDER BY ${targetCol} DESC`;

      // 날짜 필터 컬럼 설정(입금/주문)
      if (dto.searchDateType === '입금일') targetCol = 'deposit_date';

      // 시작, 끝 날짜가 다 있는 경우
      if (dto.searchStartDate && dto.searchEndDate) {
        whereSql += `\nAND (DATE(${targetCol}) >= ? AND DATE(${targetCol}) <= ?)`;
        params = [dto.searchStartDate, dto.searchEndDate];
      }
      // 시작 날짜만 있는 경우,
      if (dto.searchStartDate && !dto.searchEndDate) {
        whereSql += `\nAND DATE(${targetCol}) >= ?`;
        params = [dto.searchStartDate];
      }
      // 끝 날짜만 있는 경우,
      if (!dto.searchStartDate && dto.searchEndDate) {
        whereSql += `\nAND DATE(${targetCol}) <= ?`;
        params = [dto.searchEndDate];
      }

      if (dto.searchStatuses && dto.searchStatuses.length > 0) {
        whereSql += `\nAND (step IN (${dto.searchStatuses.join(',')})) `;
      }

      if (dto.search) {
        whereSql += `\nAND (${searchSql}) `;
        params = params.concat(new Array(19).fill(`%${dto.search}%`));
        return {
          sql: defaultQueryHead + whereSql + groupbySql + orderSql,
          params,
        };
      }

      return {
        sql: defaultQueryHead + whereSql + groupbySql + orderSql,
        params,
      };
    }

    if (dto.search) {
      whereSql = `\nAND (${searchSql})`;
      orderSql = `\nORDER BY fm_order.regist_date DESC`;

      if (dto.searchStatuses && dto.searchStatuses.length > 0) {
        whereSql += `\nAND (step IN (${dto.searchStatuses.join(',')})) `;
      }

      return {
        sql: defaultQueryHead + whereSql + groupbySql + orderSql,
        params: new Array(19).fill(`%${dto.search}%`),
      };
    }

    if (dto.searchStatuses && dto.searchStatuses.length > 0) {
      whereSql += `AND (step IN (${dto.searchStatuses.join(',')})) `;
      orderSql = `\nORDER BY fm_order.regist_date DESC`;
      return {
        sql: defaultQueryHead + whereSql + groupbySql + orderSql,
        params: [],
      };
    }
    return { sql: '', params: [] };
  }

  // * **********************************
  // * 개별 주문 조회
  // * **********************************

  /**
   * 주어진 주문 번호에 해당하는 주문 정보를 불러옵니다.
   * @param orderId 주문 번호
   */
  public async findOneOrder(
    orderId: FmOrder['order_seq'] | string,
  ): Promise<FindFmOrderDetailRes | null> {
    // * 개별 주문 정보
    const orderInfo = await this.findOneOrderInfo(orderId);
    if (!orderInfo) return null;

    // * 주문 상품
    const orderItems = await this.findOneOrderItems(orderId);

    // * 개별 주문 상품 - 상품 옵션 목록 정보
    const itemSeqArray = orderItems.map((x) => x.item_seq);
    const orderGoodsOptions = await this.findOneOrderOptions(itemSeqArray);

    // * 개별 주문 - 출고 정보
    const orderExports = await this.findOneOrderExports(orderId);

    // * 개별 주문 - 환불 정보
    const orderRefunds = await this.findOneOrderRefunds(orderId);

    // * 개별 주문 - 반품 정보
    const orderReturns = await this.findOneOrderReturns(orderId);

    return {
      ...orderInfo,
      items: orderItems.map((item) => ({
        ...item,
        options: orderGoodsOptions.filter((opt) => opt.item_seq === item.item_seq),
      })),
      exports: orderExports,
      refunds: orderRefunds,
      returns: orderReturns,
    };
  }

  /** 개별 주문 정보 조회 */
  private async findOneOrderInfo(
    orderId: FmOrder['order_seq'] | string,
  ): Promise<FmOrderMetaInfo | null> {
    const sql = `
    SELECT
      fm_order_shipping.shipping_cost,
      fm_order_shipping.delivery_cost,
      fm_order_shipping.shipping_set_name,
      fm_order_shipping.shipping_type,
      fm_order_shipping.shipping_method,
      fm_order_shipping.shipping_group,
      fm_order.order_seq as id,
      fm_order.regist_date,
      fm_order.sitetype,
      fm_order.depositor,
      fm_order.deposit_date,
      fm_order.settleprice,
      fm_order.step,
      order_seq,
      order_user_name,
      order_phone,
      order_cellphone,
      order_email,
      recipient_user_name,
      recipient_phone,
      recipient_cellphone,
      recipient_email,
      recipient_zipcode,
      recipient_address,
      recipient_address_street,
      recipient_address_detail,
      recipient_address_detail,
      memo
    FROM fm_order
    JOIN fm_order_shipping USING(order_seq)
    WHERE fm_order.order_seq = ?`;
    const result = await this.db.query(sql, [orderId]);
    const order = result.length > 0 ? result[0] : null;
    if (!order) return null;
    const parser = new FmOrderMemoParser(order.memo);
    return { ...order, memo: parser.memo };
  }

  private async findOneOrderItems(
    orderId: FmOrder['order_seq'] | string,
  ): Promise<FmOrderItem[]> {
    const sql = `
    SELECT 
      fm_order_item.goods_seq,
      fm_order_item.goods_name,
      fm_order_item.image,
      fm_order_item.item_seq
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    WHERE fm_order.order_seq = ?`;
    return this.db.query(sql, [orderId]);
  }

  /** 개별 주문 - 상품 옵션 목록 정보 조회 */
  private async findOneOrderOptions(
    itemSeqArray: Array<FmOrderItem['item_seq'] | string>,
  ): Promise<FmOrderOption[]> {
    const findOptionsSql = `SELECT
      fm_order_item_option.item_option_seq,
      fm_order_item_option.item_seq,
      fm_order_item_option.title1,
      fm_order_item_option.option1,
      fm_order_item_option.ea,
      fm_order_item_option.step,
      fm_order_item_option.step35,
      fm_order_item_option.step45,
      fm_order_item_option.step55,
      fm_order_item_option.step65,
      fm_order_item_option.step75,
      fm_order_item_option.step85,
      fm_order_item_option.member_sale,
      fm_order_item_option.mobile_sale,
      fm_order_item_option.color,
      fm_order_item_option.price,
      fm_order_item_option.ori_price
    FROM fm_order_item_option
    WHERE fm_order_item_option.item_seq IN (?)`;

    return this.db.query(findOptionsSql, [itemSeqArray]);
  }

  /** 개별 주문 - 출고 정보 */
  private async findOneOrderExports(
    orderId: FmOrder['order_seq'] | string,
  ): Promise<FmOrderExport[]> {
    const exportsSql = `SELECT
      fm_goods_export.export_code,
      fm_goods_export.bundle_export_code,
      fm_goods_export.export_date,
      fm_goods_export.complete_date,
      IF(fm_goods_export.shipping_date = "0000-00-00", null, fm_goods_export.shipping_date) as shipping_date,
      fm_goods_export.status export_status,
      fm_goods_export.delivery_company_code,
      fm_goods_export.delivery_number,
      SUM(fm_goods_export_item.ea) totalEa
    FROM fm_goods_export
    JOIN fm_goods_export_item USING(export_code)
    WHERE fm_goods_export.order_seq = ?
    GROUP BY export_code`;
    const _exports: FmOrderExportBase[] = await this.db.query(exportsSql, [orderId]);

    const exportItemsSql = `
    SELECT 
      goods_name, image,
      item_option_seq, title1, option1, color, fm_goods_export_item.ea, price, step
    FROM fm_order_item_option
      JOIN fm_order_item USING(item_seq)
    JOIN fm_goods_export_item ON item_option_seq = option_seq
    WHERE export_code = ?`;

    const result: FmOrderExport[] = await Promise.all(
      _exports.map(async (e) => {
        const items: FmOrderExportItemOption[] = await this.db.query(exportItemsSql, [
          e.export_code,
        ]);
        return {
          ...e,
          itemOptions: items,
        };
      }),
    );

    return result;
  }

  /** 개별 주문 - 환불 정보 */
  private async findOneOrderRefunds(
    orderId: FmOrder['order_seq'] | string,
  ): Promise<FmOrderRefund[]> {
    const sql = `SELECT
      fm_order_refund.refund_code,
      fm_order_refund.refund_type,
      fm_order_refund.regist_date,
      fm_order_refund.refund_date,
      fm_order_refund.status,
      fm_order_refund.refund_reason,
      fm_manager.manager_id,
      fm_manager.memail,
      fm_manager.mcellphone,
      SUM(fm_order_refund_item.ea) ea,
      SUM(fm_order_refund_item.refund_goods_price) refund_goods_price
    FROM fm_order_refund
    LEFT JOIN fm_manager USING(manager_seq)
    JOIN fm_order_refund_item USING(refund_code)
    WHERE order_seq = ?
    GROUP BY refund_code
    `;
    const refunds: FmOrderRefund[] = await this.db.query(sql, [orderId]);

    const result = await Promise.all(
      refunds.map(async (ref) => {
        const refundItems: FmOrderRefundItem[] = await this.db.query(
          `SELECT
            goods_name,
            image,
            fm_order_refund_item.refund_item_seq,
            fm_order_refund_item.item_seq,
            fm_order_refund_item.option_seq,
            fm_order_refund_item.ea,
            fm_order_item_option.item_option_seq,
            fm_order_item_option.title1,
            fm_order_item_option.option1,
            fm_order_item_option.ea,
            fm_order_item_option.step,
            fm_order_item_option.member_sale,
            fm_order_item_option.mobile_sale,
            fm_order_item_option.color,
            fm_order_item_option.price,
            fm_order_item_option.ori_price
          FROM fm_order_refund_item
              JOIN fm_order_item USING(item_seq)
          JOIN fm_order_item_option
            ON fm_order_item_option.item_option_seq = fm_order_refund_item.option_seq
          WHERE refund_code = ?`,
          [ref.refund_code],
        );

        return { ...ref, items: refundItems };
      }),
    );

    return result;
  }

  /** 개별 주문 - 교환 정보 */
  private async findOneOrderReturns(
    orderId: FmOrder['order_seq'] | string,
  ): Promise<FmOrderReturn[]> {
    const sql = `SELECT
      fm_order_return.return_code,
      fm_order_return.refund_code,
      fm_order_return.return_type,
      fm_order_return.status,
      fm_order_return.regist_date,
      fm_order_return.return_date,
      fm_order_return.reason_desc,
      fm_order_return.return_reason,
      fm_order_return.return_method,
      fm_order_return.sender_zipcode,
      fm_order_return.sender_address_type,
      fm_order_return.sender_address,
      fm_order_return.sender_address_street,
      fm_order_return.sender_address_detail,
      fm_order_return.phone,
      fm_order_return.cellphone,
      fm_manager.manager_id,
      fm_manager.memail,
      fm_manager.mcellphone,
      SUM(fm_order_return_item.ea) ea
    FROM fm_order_return
    LEFT JOIN fm_manager USING(manager_seq)
    JOIN fm_order_return_item USING(return_code)
    WHERE order_seq = ?
    GROUP BY return_code
    `;
    const returns: FmOrderReturnBase[] = await this.db.query(sql, [orderId]);

    const result = await Promise.all(
      returns.map(async (ret) => {
        const returnItems: FmOrderReturnItem[] = await this.db.query(
          `SELECT
            goods_name,
            image,
            fm_order_return_item.return_item_seq,
            fm_order_return_item.item_seq,
            fm_order_return_item.option_seq,
            fm_order_return_item.ea,
            fm_order_return_item.reason_desc,
            fm_order_item_option.item_option_seq,
            fm_order_item_option.title1,
            fm_order_item_option.option1,
            fm_order_item_option.ea,
            fm_order_item_option.step,
            fm_order_item_option.member_sale,
            fm_order_item_option.mobile_sale,
            fm_order_item_option.color,
            fm_order_item_option.price,
            fm_order_item_option.ori_price
          FROM fm_order_return_item
          JOIN fm_order_item USING(item_seq)
          JOIN fm_order_item_option
            ON fm_order_item_option.item_option_seq = fm_order_return_item.option_seq
          WHERE return_code = ?`,
          [ret.return_code],
        );

        return { ...ret, items: returnItems };
      }),
    );

    return result;
  }

  // * **********************************
  // * 주문 상태 변경
  // * **********************************

  /** 주문 상태 변경 */
  public async changeOrderStatus(
    orderId: FmOrder['order_seq'] | string,
    targetStatus: FmOrderStatusNumString,
  ): Promise<boolean> {
    const orderStatusSql = `UPDATE
      fm_order, fm_order_item_option 
    SET fm_order.step = ?, fm_order_item_option.step = ?
    WHERE
      fm_order.order_seq = ?
    AND fm_order.order_seq = fm_order_item_option.order_seq
    AND ea != step85`;

    switch (targetStatus) {
      // 결제확인으로 되돌리기
      case '25': {
        const orderItemOptionSql = `UPDATE fm_order_item_option
        SET step35 = 0
        WHERE order_seq = ? AND ea != step85`;

        return this.db.transactionQuery(async (conn) => {
          await conn.query(orderStatusSql, [targetStatus, targetStatus, orderId]);
          await conn.query(orderItemOptionSql, [orderId]);
          conn.commit();
          return true;
        });
      }
      // 상품준비로 변경
      case '35': {
        const orderItemOptionSql = `UPDATE fm_order_item_option
        SET step35 = ea
        WHERE order_seq = ? AND ea != step85`;

        return this.db.transactionQuery(async (conn) => {
          await conn.query(orderStatusSql, [targetStatus, targetStatus, orderId]);
          await conn.query(orderItemOptionSql, [orderId]);
          conn.commit();
          return true;
        });
      }
      default:
        throw new BadRequestException('targetStatus parameter is required');
    }
  }

  // * **********************************
  // * 주문 현황 조회
  // * **********************************
  public async getOrdersStats(goodsIds: number[]): Promise<FindFmOrderRes[]> {
    const sql = `
    SELECT
      fm_order.*
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    WHERE fm_order_item.goods_seq IN (${goodsIds.join(',')})
    AND DATE(regist_date) >= ?
    ORDER BY regist_date DESC
    `;
    const exMonth = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    const data = (await this.db.query(sql, [exMonth])) as FindFmOrderRes[];

    const counter = statCounter();
    const result = data.map((x) => ({ ...x }));
    // 주문현황을 위한 counting
    data.forEach((x) => {
      counter.count(x.step, x.regist_date, x.payment_price);
    });
    console.log(counter.stats);
    //
    return result;
  }
}
