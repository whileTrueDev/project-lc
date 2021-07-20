import { Injectable } from '@nestjs/common';
import { FirstmallDbService } from '../firstmall-db.service';

@Injectable()
export class FMGoodsService {
  constructor(private readonly db: FirstmallDbService) {}

  async findAll(): Promise<any[]> {
    const query = 'select * from fm_goods order by regist_date desc limit 1';
    return this.db.query(query);
  }
}
