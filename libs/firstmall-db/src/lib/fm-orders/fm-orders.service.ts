import { Injectable } from '@nestjs/common';
import { FindFmOrderRes, FindFmOrdersDto, FmOrder } from '@project-lc/shared-types';
import { FirstmallDbService } from '../firstmall-db.service';

@Injectable()
export class FmOrdersService {
  constructor(private readonly db: FirstmallDbService) {}

  /**
   * 퍼스트몰의 주문 목록을 조회
   * @returns {FindFmOrderRes[]}
   */
  async findOrders(dto: FindFmOrdersDto): Promise<FindFmOrderRes[]> {
    const { sql, params } = this.createFindOrdersQuery(dto);
    if (!sql) return [];
    const data = (await this.db.query(sql, params)) as FmOrder[];
    return data.map((x) => ({ ...x, id: x.order_seq }));
  }

  private createFindOrdersQuery(dto: FindFmOrdersDto) {
    const defaultQueryHead = `
    SELECT fm_order_item.goods_name, fm_order.*
    FROM fm_order
    JOIN fm_order_item USING(order_seq)
    `;
    const searchSql = `goods_name LIKE ?
    OR order_seq LIKE ?
    OR fm_order.order_seq LIKE ?
    OR fm_order.recipient_user_name LIKE ?
    OR fm_order.depositor LIKE ?
    OR fm_order.order_cellphone LIKE ?
    OR fm_order.order_phone LIKE ?
    OR fm_order.recipient_cellphone LIKE ?
    OR fm_order.recipient_phone LIKE ?
    OR fm_order.order_email LIKE ?
    OR fm_order.recipient_user_name LIKE ?
    OR fm_order_item.goods_name LIKE ?
    OR fm_order_item.item_seq LIKE ?`;

    let whereSql = '';
    let orderSql = '';
    let params = [];

    if (dto.searchStartDate || dto.searchEndDate) {
      let targetCol = 'regist_date';
      orderSql = `ORDER BY ${targetCol}`;

      // 날짜 필터 컬럼 설정(입금/주문)
      if (dto.searchDateType === '입금일') targetCol = 'deposit_date';

      // 시작, 끝 날짜가 다 있는 경우
      if (dto.searchStartDate && dto.searchEndDate) {
        whereSql += `WHERE ${targetCol} >= ? AND ${targetCol} <= ?`;
        params = [dto.searchStartDate, dto.searchEndDate];
      }
      // 시작 날짜만 있는 경우,
      if (dto.searchStartDate && !dto.searchEndDate) {
        whereSql += `WHERE ${targetCol} >= ?`;
        params = [dto.searchStartDate];
      }
      // 끝 날짜만 있는 경우,
      if (!dto.searchStartDate && dto.searchEndDate) {
        whereSql += `WHERE ${targetCol} <= ?`;
        params = [dto.searchEndDate];
      }

      if (dto.search) {
        whereSql += `\nAND (${searchSql}) `;
        params = params.concat(new Array(13).fill(`%${dto.search}%`));
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
      whereSql = `WHERE ${searchSql}`;
      orderSql = `ORDER BY fm_order.regist_date DESC`;
      return {
        sql: defaultQueryHead + whereSql + orderSql,
        params: new Array(13).fill(`%${dto.search}%`),
      };
    }
    return { sql: '', params: [] };
  }
}
