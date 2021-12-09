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
  FmOrderShipping,
  FmOrderStatusNumString,
  getFmOrderStatusByNames,
  OrderStatsRes,
  LiveShoppingWithSalesAndFmId,
  ChangeReturnStatusDto,
  fmOrderStatuses,
} from '@project-lc/shared-types';
import { FmOrderMemoParser } from '@project-lc/utils';
import dayjs from 'dayjs';
import { FirstmallDbService } from '../firstmall-db.service';
import { StatCounter } from './utills/statCounter';

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
    const data = (await this.db.query(sql, params)) as Omit<FindFmOrderRes, ''>[];

    const detailAtteched = await Promise.all(
      data.map(async (order) => {
        // * item_seq로 상품 옵션 찾아 총 상품 금액 계산하기
        const orderInfoPerMyGoods = await this.findOneOrderTotalInfoPerMyGoods(
          order.item_seq,
        );

        // * 판매자 상품에 기반한 주문 상태 도출
        // 주문 상품 조회
        const orderItems = await this.findOneOrderItems(order.order_seq, goodsIds);
        // 개별 주문 상품 - 상품 옵션 목록 정보
        const itemSeqArray = orderItems.map((x) => x.item_seq);
        const orderGoodsOptions = await this.findOneOrderOptions(itemSeqArray);
        // 판매자 상품에 기반한 주문 상태 도출
        const realStep = this.getOrderRealStep(order.step, orderGoodsOptions);

        const totalShippingCost = await this.findOrderTotalShippingCost(
          order.id,
          order.shipping_seq,
        );

        return {
          ...order,
          ...orderInfoPerMyGoods,
          step: realStep,
          totalShippingCost,
          totalDeliveryCost: totalShippingCost,
        };
      }),
    );

    if (dto.searchStatuses && dto.searchStatuses.length > 0) {
      return detailAtteched.filter((x) => dto.searchStatuses.includes(x.step));
    }
    return detailAtteched;
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
      GROUP_CONCAT(fm_order_item.goods_seq SEPARATOR ', ') AS goods_seq,
      GROUP_CONCAT(item_seq SEPARATOR ', ') AS item_seq,
      GROUP_CONCAT(goods_name SEPARATOR ', ') AS goods_name,
      GROUP_CONCAT(fm_order_shipping.shipping_seq) AS shipping_seq,
      fm_order.order_seq as id,
      fm_order.*
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    JOIN fm_order_shipping USING(shipping_seq)
    JOIN (
      SELECT item_seq, MIN(step) AS optionRealStep
      FROM fm_order_item_option
      JOIN fm_order_item USING(item_seq)
      WHERE goods_seq IN (${goodsIds.join(',')})
      GROUP BY item_seq
    ) fm_order_item_option USING(item_seq)
    WHERE fm_order_item.goods_seq IN (${goodsIds.join(',')}) AND step IN (
      15, 25, 35, 40, 45, 50, 55, 60, 65, 70, 75, 85, 95, 99
    )
    `;

    const searchSql = `goods_name LIKE ?
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

      return {
        sql: defaultQueryHead + whereSql + groupbySql + orderSql,
        params: new Array(19).fill(`%${dto.search}%`),
      };
    }

    if (dto.searchStatuses && dto.searchStatuses.length > 0) {
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
    goodsIds: number[],
  ): Promise<FindFmOrderDetailRes | null> {
    // * 개별 주문 정보
    const orderInfo = await this.findOneOrderInfo(orderId, goodsIds);
    if (!orderInfo) return null;

    // * 주문 상품
    const orderItems = await this.findOneOrderItems(orderId, goodsIds);
    if (orderItems.length === 0) return null;

    // * 개별 주문 상품 - 상품 옵션 목록 정보
    const itemSeqArray = orderItems.map((x) => x.item_seq);
    const orderGoodsOptions = await this.findOneOrderOptions(itemSeqArray);

    // * 개별 주문 - 출고 정보
    const orderExports = await this.findOneOrderExports(orderId, itemSeqArray);

    // * 개별 주문 - 환불 정보
    const orderRefunds = await this.findOneOrderRefunds(orderId);

    // * 개별 주문 - 반품 정보
    const orderReturns = await this.findOneOrderReturns(orderId);

    // * 판매자 상품에 기반한 주문 상태 도출
    const realStep = this.getOrderRealStep(orderInfo.step, orderGoodsOptions);

    // * 배송 관련 정보 추가를 위한 정보 조회
    const shippingResult = await this.findOneOrderShippingInfo(
      orderId,
      orderInfo.shipping_seq,
      goodsIds,
    );
    const totalShippingCost = await this.findOrderTotalShippingCost(
      orderId,
      orderInfo.shipping_seq,
    );

    // * 주문 중, 내 상품에 대한 총 주문 금액, 총 수량, 종 종류 정보
    const totalInfo = await this.findOneOrderTotalInfoPerMyGoods(itemSeqArray.join(','));

    return {
      ...orderInfo,
      ...totalInfo,
      totalShippingCost,
      totalDeliveryCost: totalShippingCost,
      items: orderItems.map((item) => ({
        ...item,
        options: orderGoodsOptions.filter((opt) => opt.item_seq === item.item_seq),
      })),
      exports: orderExports,
      refunds: orderRefunds,
      returns: orderReturns,
      step: realStep,
      shippings: shippingResult,
    };
  }

  /** 개별 주문 정보 조회 */
  private async findOneOrderInfo(
    orderId: FmOrder['order_seq'] | string,
    goodsIds: number[],
  ): Promise<FmOrderMetaInfo | null> {
    const sql = `
    SELECT
      GROUP_CONCAT(fm_order_shipping.shipping_seq) AS shipping_seq,
      fm_order.order_seq as id,
      fm_order.regist_date,
      fm_order.sitetype,
      fm_order.depositor,
      fm_order.deposit_date,
      fm_order.settleprice,
      fm_order.step,
      fm_order.order_seq,
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
    JOIN fm_order_shipping USING(shipping_seq)
    WHERE fm_order.order_seq = ? AND goods_seq IN (${goodsIds.join(',')})
    `;
    const result: FmOrderMetaInfo[] = await this.db.query(sql, [orderId]);
    const order = result.length > 0 ? result[0] : null;
    if (!order) return null;
    // step이 정상적이지 않은 주문인 경우 조회하지 않음.
    if (!Object.keys(fmOrderStatuses).includes(order.step)) return null;

    const parser = new FmOrderMemoParser(order.memo);
    return {
      ...order,
      memo: parser.memo,
      memoOriginal: order.memo,
    };
  }

  /** 개별 주문 상품 정보 조회 */
  private async findOneOrderItems(
    orderId: FmOrder['order_seq'] | string,
    goodsIds: number[],
  ): Promise<FmOrderItem[]> {
    const sql = `
    SELECT 
      fm_order_item.goods_seq,
      fm_order_item.goods_name,
      fm_order_item.image,
      fm_order_item.item_seq,
      fm_order_shipping.shipping_seq,
      fm_order_shipping.shipping_set_name,
      fm_order_shipping.shipping_type,
      fm_order_shipping.shipping_method,
      fm_order_shipping.shipping_group
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    JOIN fm_order_shipping USING(shipping_seq)
    WHERE fm_order.order_seq = ?
    AND goods_seq IN (${goodsIds.join(',')})`;
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
      fm_order_item_option.price,
      fm_order_item_option.ori_price
    FROM fm_order_item_option
    WHERE fm_order_item_option.item_seq IN (?)`;

    return this.db.query(findOptionsSql, itemSeqArray);
  }

  /** 개별 주문 - 출고 정보 */
  private async findOneOrderExports(
    orderId: FmOrder['order_seq'] | string,
    itemSeqArray: number[],
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
    AND fm_goods_export_item.item_seq IN (${itemSeqArray.join(',')})
    GROUP BY export_code`;
    const _exports: FmOrderExportBase[] = await this.db.query(exportsSql, [orderId]);

    const exportItemsSql = `
    SELECT 
      goods_name, image,
      item_option_seq, title1, option1, fm_goods_export_item.ea, price, step
    FROM fm_order_item_option
      JOIN fm_order_item USING(item_seq)
    JOIN fm_goods_export_item ON item_option_seq = option_seq
    WHERE export_code = ?
    `;

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
      SUM(fm_order_refund_item.ea) totalEa,
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

  /** 개별 주문 - 총 주문 금액 (내 상품만) */
  private async findOneOrderTotalInfoPerMyGoods(
    itemSeqs: string,
  ): Promise<Pick<FindFmOrderRes, 'totalEa' | 'totalPrice' | 'totalType'>> {
    const result: Pick<FindFmOrderRes, 'totalEa' | 'totalPrice' | 'totalType'>[] =
      await this.db.query(`
    SELECT
      SUM(price) AS totalPrice,
      SUM(ea) AS totalEa,
      (SELECT COUNT(*) FROM (
        SELECT SUM(item_option_seq)
        FROM fm_order_item_option
        WHERE item_seq IN (${itemSeqs})
        GROUP BY item_option_seq
      ) AS totalType) totalType
    FROM fm_order_item_option
    WHERE item_seq IN (${itemSeqs})`);
    if (result.length === 0) return null;
    return result[0];
  }

  /** 개별 주문상품의 배송정보 조회 */
  public async findOneOrderShippingInfoPerMyOrderItem(
    orderItemSeq: FmOrderItem['item_seq'],
  ): Promise<FmOrderShipping> {
    const shppingInfo: FmOrderShipping[] = await this.db.query(
      `SELECT
    shipping_seq,
    shipping_set_name,
    shipping_type,
    shipping_method,
    shipping_group,
    shipping_cost,
    delivery_cost
  FROM fm_order_shipping
    JOIN fm_order_item USING(shipping_seq)
  WHERE item_seq = ?`,
      [orderItemSeq],
    );
    if (shppingInfo.length === 0) return null;
    return shppingInfo[0];
  }

  /** 주문의 총 배송비 조회 */
  private async findOrderTotalShippingCost(
    orderId: FmOrder['order_seq'] | string,
    orderShippingSeqArrStr: string,
  ): Promise<string> {
    const totalInfo: Pick<FmOrderShipping, 'shippingCost'>[] = await this.db.query(
      `SELECT SUM(shipping_cost) AS shippingCost
      FROM fm_order_shipping
      WHERE shipping_seq IN (${orderShippingSeqArrStr}) AND order_seq = ?`,
      [orderId],
    );

    if (totalInfo.length === 0) return '0';
    return totalInfo[0].shippingCost;
  }

  /**
   * 개별 주문 - 배송정보 (내 상품만)
   * @param shipping_seq 41, 42, 43 과 같이 "," 로 구분된 shipping_seq 문자열 */
  private async findOneOrderShippingInfo(
    orderId: number | string,
    shipping_seq: string,
    goodsIds: number[],
  ): Promise<FmOrderShipping[]> {
    const shippingResult: FmOrderShipping[] = await this.db.query(
      `SELECT
      shipping_seq,
      shipping_set_name,
      shipping_type,
      shipping_method,
      shipping_group,
      shipping_cost,
      delivery_cost
    FROM fm_order_shipping WHERE shipping_seq IN (${shipping_seq}) AND order_seq = ?`,
      [orderId],
    );

    const result = await Promise.all(
      shippingResult.map(async (sh) => {
        // * 주문 중, 이 배송방식으로 주문된 주문상품목록 조회
        const shippingItems: FmOrderItem[] = await this.db.query(
          `SELECT fm_order_item.goods_seq,
            fm_order_item.goods_name,
            fm_order_item.image,
            fm_order_item.item_seq,
            shipping_seq,
            shipping_set_name,
            shipping_type,
            shipping_method,
            shipping_group
          FROM fm_order_item
          JOIN fm_order_shipping USING (shipping_seq)
          WHERE
            shipping_seq = ?
            AND fm_order_item.order_seq = ? 
            AND goods_seq IN (?)`,
          [sh.shipping_seq, orderId, goodsIds],
        );

        // * 해당 item의 옵션 정보 조회
        const shippingItemsWithOptions = await Promise.all(
          shippingItems.map(async (si) => ({
            ...si,
            options: await this.findOneOrderOptions([si.item_seq]),
          })),
        );

        return {
          ...sh,
          items: shippingItemsWithOptions,
        };
      }),
    );

    return result;
  }

  // * **********************************
  // * 주문 상태 관련
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

  /**
   * 판매자 본인의 상품에 의거한 실제 주문 상태를 조회합니다.
   * 이는 여러 판매자의 상품이 하나의 주문에 포함될 수 있는 상황에 대한 처리 용도입니다.
   */
  private getOrderRealStep(
    fmOrderStep: FmOrder['step'],
    myOrderGoodsOptions: FmOrderOption[],
  ): FmOrder['step'] {
    if (myOrderGoodsOptions.length === 0) return fmOrderStep;
    const isPartialStep = getFmOrderStatusByNames([
      '부분배송완료',
      '부분배송중',
      '부분출고완료',
      '부분출고준비',
    ]).includes(fmOrderStep);

    // 주문의 상태가 "부분0000"일 때,
    if (isPartialStep) {
      // 5를 더해 "부분" 상태를 제거한 상태
      const nonPartialStep = String(Number(fmOrderStep) + 5) as FmOrder['step'];
      // 옵션들 모두가 "부분" 상태를 제거한 상태만 있는 지 확인, 그렇다면 "부분" 상태를 제거한 상태를 반환
      if (myOrderGoodsOptions.every((o) => o.step === nonPartialStep)) {
        return nonPartialStep;
      }
      // 옵션들 모두가 "부분" 상태보다 작은지 확인, 그렇다면 옵션들 중 가장 높은 상태를 반환
      if (myOrderGoodsOptions.every((o) => Number(o.step) < Number(fmOrderStep))) {
        return myOrderGoodsOptions.reduce((acc, curr) => {
          if (!acc) return curr.step;
          if (Number(acc) < Number(curr.step)) return curr.step;
          return acc;
        }, myOrderGoodsOptions[0].step);
      }
      // 하나라도 더 낮은, 더 높은 상태가 있는 경우 "부분0000"상태를 그대로 반환
      return fmOrderStep;
    }

    // 옵션들 모두가 주문상태보다 작은지 확인, 그렇다면 옵션들 중 가장 높은 상태를 반환
    if (myOrderGoodsOptions.every((o) => Number(o.step) < Number(fmOrderStep))) {
      return myOrderGoodsOptions.reduce((acc, curr) => {
        if (!acc) return curr.step;
        if (Number(acc) < Number(curr.step)) return curr.step;
        return acc;
      }, myOrderGoodsOptions[0].step);
    }

    return fmOrderStep;
  }

  // * **********************************
  // * 주문 현황 조회
  // * **********************************
  public async getOrdersStats(goodsIds: number[]): Promise<OrderStatsRes> {
    const sql = `
    SELECT 
      order_seq, 
      payment_price,
      regist_date,	
      min(step) as step
    FROM (
    SELECT
      order_seq,
      payment_price,
      regist_date,
      goods_seq,
      item_seq
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    WHERE fm_order_item.goods_seq IN (${goodsIds.join(',')})
    AND DATE(regist_date) >= ?
    ) AS A
    JOIN fm_order_item_option AS B USING (order_seq, item_seq)
    GROUP BY order_seq
    `;
    const exMonth = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    const data = (await this.db.query(sql, [exMonth])) as FindFmOrderRes[];

    const counter = StatCounter();
    data.forEach((x) => {
      counter.count(x.step, x.regist_date, x.payment_price);
    });

    return {
      orders: counter.orders,
      sales: counter.sales,
    };
  }

  public async changeReturnStatus(dto: ChangeReturnStatusDto): Promise<boolean> {
    const returnStatusSql = `
      UPDATE
        fm_order_return
      SET 
        fm_order_return.status = ?
      WHERE
        fm_order_return.return_code = ?
    `;
    await this.db.query(returnStatusSql, [dto.status, dto.return_code]);

    return true;
  }

  public async getOrdersStatsDuringLiveShoppingSales(
    dto: LiveShoppingWithSalesAndFmId[],
  ): Promise<{ id: number; sales: string }[]> {
    const salesPrice = [];

    const sql = `
    SELECT
      SUM(fm_order.payment_price) as sales
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    WHERE fm_order_item.goods_seq IN (?)
    AND
    DATE(regist_date) BETWEEN ? AND ?;
    `;
    await Promise.all(
      dto.map(async (val) => {
        const sellStartDate = dayjs(val.sellStartDate).format('YYYY-MM-DD HH:mm:ss');
        const sellEndDate = dayjs(val.sellEndDate).format('YYYY-MM-DD HH:mm:ss');
        const salesSum = await this.db.query(sql, [
          val.firstmallGoodsConnectionId,
          sellStartDate,
          sellEndDate,
        ]);
        salesPrice.push({
          id: val.id,
          sales: salesSum[0].sales ? Number(salesSum[0].sales).toFixed() : null,
        });
      }),
    );

    return salesPrice;
  }
}
