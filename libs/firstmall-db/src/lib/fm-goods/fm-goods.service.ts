import { Injectable } from '@nestjs/common';
import { FmGoodsOption } from '@project-lc/shared-types';
import { FirstmallDbService } from '../firstmall-db.service';

@Injectable()
export class FMGoodsService {
  constructor(private readonly db: FirstmallDbService) {}

  async findAll(): Promise<any[]> {
    const query = 'select * from fm_goods order by regist_date desc limit 1';
    return this.db.query(query);
  }

  async findOneGoodsOption({
    goodsSeq,
    optionTitle,
    option1,
  }: {
    goodsSeq: number | string;
    optionTitle: string | null;
    option1: string;
  }): Promise<FmGoodsOption> {
    if (!optionTitle) {
      const query = `SELECT * FROM fm_goods_option WHERE goods_seq = ? AND option_title IS NULL AND option1 = ? LIMIT 1`;
      const option = await this.db.query(query, [goodsSeq, option1]);
      if (option.length > 0) return option[0];
      return null;
    }
    const query = `SELECT * FROM fm_goods_option WHERE goods_seq = ? AND option_title = ? AND option1 = ? LIMIT 1`;
    const option = await this.db.query(query, [goodsSeq, optionTitle, option1]);
    if (option.length > 0) return option[0];
    return null;
  }
}
