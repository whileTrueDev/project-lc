/* eslint-disable camelcase */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirstmallDbService } from '../firstmall-db.service';

@Injectable()
export class FMGoodsService {
  constructor(private readonly db: FirstmallDbService) {}

  async findAll(): Promise<any[]> {
    const query = 'select * from fm_goods order by regist_date desc limit 1';
    return this.db.query(query);
  }

  // fm-goods테이블 & 상품 연관테이블에서 goods_seq 값이 있는 데이터 삭제
  async deleteFmGoods(ids: number[]): Promise<boolean> {
    const idsParam = ids.join(',');
    try {
      const sqls = [
        `DELETE FROM fm_category_link WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_addition WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_icon WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_input WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_option WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_relation WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_relation_seller WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_suboption WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_supply WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_image WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods_coupon_serial WHERE goods_seq IN (${idsParam})`,
        `DELETE FROM fm_goods WHERE goods_seq IN (${idsParam})`,
      ];
      return this.db.transactionQuery(async (conn) => {
        const queryPromises = sqls.map((sql) => conn.query(sql));
        await Promise.all(queryPromises);
        await conn.commit();
        return true;
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // 상품의 옵션과 재고정보 조회
  async getStockInfo(goodsSeq: number) {
    const query = `
      SELECT 
        o.*,
        s.stock as stock,
        case when s.stock <= 0 then 1 else 0 end as stocknothing,
        s.badstock as badstock,
        s.reservation15 as reservation15,
        s.reservation25 as reservation25,
        s.total_supply_price	as total_supply_price,
        s.total_stock			as total_stock,
        s.total_badstock		as total_badstock,
			  case when ( CONVERT(s.stock * 1, SIGNED) - CONVERT(s.reservation15 * 1, SIGNED)) <= 0 then 1 else 0 end as rstocknothing
      FROM 
        fm_goods_option o, fm_goods_supply s
      WHERE 
        o.option_seq = s.option_seq 
        AND o.goods_seq =${goodsSeq}
    `;

    const data = await this.db.query(query);

    // 해당 상품의 옵션별 이름, 가격, 재고정보---------------------
    const optionsInfo = data.map((option) => {
      const {
        option_seq, // 옵션 id
        default_option, // 필수여부
        option_title, // 옵션명(색상 등)
        option1, // 옵션1 값 (화이트 등)
        consumer_price, // 소비자가
        price, // 판매가
        stock, // 재고
        badstock, // 불량재고
        reservation15, // 주문접수 이상 출고예약량,
        option_view, // 옵션 노출 여부
      } = option;

      return {
        id: option_seq,
        default_option,
        option_title,
        option1,
        consumer_price,
        price,
        stock,
        badstock,
        option_view,
        rstock: stock - badstock - reservation15, // 해당 옵션의 가용재고
      };
    });

    return optionsInfo;
  }

  // goods_seq인 상품의 노출정보 변경
  async changeGoodsView(id: number, view: 'look' | 'notLook'): Promise<boolean> {
    const query = `
    UPDATE fm_goods 
    SET goods_view='${view}'
    WHERE goods_seq=${id}
    `;
    try {
      await this.db.query(query);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
