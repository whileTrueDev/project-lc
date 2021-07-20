import { createPool, Pool } from 'mysql2/promise';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirstmallDbService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      uri: process.env.FIRSTMALL_DATABASE_URL,
    });
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const conn = await this.pool.getConnection();
    const [rows] = await conn.query(sql, params);
    // 필요시 에러처리 등 추가
    return rows;
  }
}
