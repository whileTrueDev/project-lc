import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FindFmOrderDetailRes,
  FindFmOrderRes,
  FindFmOrdersDto,
  FmOrder,
  FmOrderExport,
  FmOrderMetaInfo,
  FmOrderOption,
  FmOrderRefund,
  FmOrderReturn,
  FmOrderReturnBase,
  FmOrderStatusNumString,
} from '@project-lc/shared-types';
import { FirstmallDbService } from '../firstmall-db.service';

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
  private createFindOrdersQuery(goodsIds: number[], dto: FindFmOrdersDto) {
    const defaultQueryHead = `
      SELECT fm_order_item.goods_name, fm_order.order_seq as id, fm_order.*
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
      OR REPLACE(fm_order.order_phone, "-", "") LIKE ?`;

    let whereSql = '';
    let orderSql = '';
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
        params = params.concat(new Array(15).fill(`%${dto.search}%`));
        return {
          sql: defaultQueryHead + whereSql + orderSql,
          params,
        };
      }

      return {
        sql: defaultQueryHead + whereSql + orderSql,
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
        sql: defaultQueryHead + whereSql + orderSql,
        params: new Array(15).fill(`%${dto.search}%`),
      };
    }

    if (dto.searchStatuses && dto.searchStatuses.length > 0) {
      whereSql += `AND (step IN (${dto.searchStatuses.join(',')})) `;
      orderSql = `\nORDER BY fm_order.regist_date DESC`;
      return {
        sql: defaultQueryHead + whereSql + orderSql,
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
    orderId: FmOrder['order_seq'],
  ): Promise<FindFmOrderDetailRes | null> {
    // * 개별 주문 정보
    const orderInfo = await this.findOneOrderInfo(orderId);
    if (!orderInfo) return null;

    // * 개별 주문 - 상품 옵션 목록 정보
    const orderGoodsOptions = await this.findOneOrderOptions(orderId);

    // * 개별 주문 - 출고 정보
    const orderExports = await this.findOneOrderExports(orderId);

    // * 개별 주문 - 환불 정보
    const orderRefunds = await this.findOneOrderRefunds(orderId);

    // * 개별 주문 - 반품 정보
    const orderReturns = await this.findOneOrderReturns(orderId);

    return {
      ...orderInfo,
      options: orderGoodsOptions,
      exports: orderExports,
      refunds: orderRefunds,
      returns: orderReturns,
    };
  }

  /** 개별 주문 정보 조회 */
  private async findOneOrderInfo(
    orderId: FmOrder['order_seq'],
  ): Promise<FmOrderMetaInfo> {
    const sql = `
    SELECT
      fm_order_item.goods_seq,
      fm_order_item.goods_name,
      fm_order_item.image,
      fm_order_shipping.shipping_cost,
      fm_order_shipping.delivery_cost,
      fm_order_shipping.shipping_set_name,
      fm_order_shipping.shipping_type,
      fm_order.order_seq as id,
      fm_order.regist_date,
      fm_order.sitetype,
      fm_order.depositor,
      fm_order.deposit_date,
      fm_order.settleprice,
      fm_order.step,
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
    JOIN fm_order_item USING(order_seq)
    JOIN fm_order_shipping USING(order_seq)
    LEFT JOIN fm_goods_export USING(order_seq)
    WHERE fm_order.order_seq = ?`;
    const result = await this.db.query(sql, [orderId]);
    if (result.length > 0) return result[0];
    return null;
  }

  /** 개별 주문 - 상품 옵션 목록 정보 조회 */
  private async findOneOrderOptions(
    orderId: FmOrder['order_seq'],
  ): Promise<FmOrderOption[]> {
    const findOptionsSql = `SELECT
      fm_order_item_option.item_option_seq,
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
      fm_order_item_option.ori_price,
      fm_goods_export_item.export_code,
      fm_order_refund_item.refund_code,
      fm_order_return_item.return_code
    FROM fm_order_item_option
    LEFT JOIN fm_goods_export_item
      ON fm_goods_export_item.option_seq = fm_order_item_option.item_option_seq
    LEFT JOIN fm_order_refund_item
      ON fm_order_refund_item.option_seq = fm_order_item_option.item_option_seq
    LEFT JOIN fm_order_return_item
      ON fm_order_return_item.option_seq = fm_order_item_option.item_option_seq
    WHERE order_seq = ?`;

    const result = await this.db.query(findOptionsSql, [orderId]);
    return result;
  }

  /** 개별 주문 - 출고 정보 */
  private async findOneOrderExports(
    orderId: FmOrder['order_seq'],
  ): Promise<FmOrderExport> {
    const exportsSql = `SELECT
      fm_goods_export.export_code,
      fm_goods_export.export_date,
      fm_goods_export.complete_date,
      fm_goods_export.shipping_date,
      fm_goods_export.status export_status,
      fm_goods_export.delivery_company_code,
      fm_goods_export.delivery_number,
      SUM(fm_goods_export_item.ea) ea
    FROM fm_goods_export
    JOIN fm_goods_export_item USING(export_code)
    WHERE fm_goods_export.order_seq = ?
    GROUP BY export_code
    `;
    const exports = await this.db.query(exportsSql, [orderId]);
    if (exports.length > 0) return exports[0];
    return null;
  }

  /** 개별 주문 - 환불 정보 */
  private async findOneOrderRefunds(
    orderId: FmOrder['order_seq'],
  ): Promise<FmOrderRefund> {
    const sql = `SELECT
      fm_order_refund.refund_code,
      fm_order_refund.refund_type,
      fm_order_refund.regist_date,
      fm_order_refund.refund_date,
      fm_order_refund.status,
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
    const result = await this.db.query(sql, [orderId]);
    if (result.length === 0) return null;
    return result[0];
  }

  /** 개별 주문 - 교환 정보 */
  private async findOneOrderReturns(
    orderId: FmOrder['order_seq'],
  ): Promise<FmOrderReturn> {
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
    const result = await this.db.query(sql, [orderId]);
    if (result.length === 0) return null;

    const returns = result[0] as FmOrderReturnBase;

    const itemsResult = await this.db.query(
      `SELECT
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
      JOIN fm_order_item_option
        ON fm_order_item_option.item_option_seq = fm_order_return_item.option_seq
      WHERE return_code = ?`,
      [returns.return_code],
    );

    return {
      ...returns,
      items: itemsResult,
    };
  }

  /** 주문 상태 변경 */
  public async changeOrderStatus(
    orderId: FmOrder['order_seq'],
    targetStatus: FmOrderStatusNumString,
  ) {
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
}
