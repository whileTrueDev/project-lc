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
  async deleteFmGoods(ids: number[]): Promise<any> {
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
      await this.db.transaction(sqls);
      return 'done';
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // goods_seq인 상품의 옵션과 재고정보 조회
  async getStockInfo(goodsSeq: number) {
    const query = `
      SELECT 
    `;
  }
}
