import { createPool, Pool, Connection } from 'mysql2/promise';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class FirstmallDbService {
  private pool: Pool;

  constructor() {
    this.pool = createPool({
      uri: process.env.FIRSTMALL_DATABASE_URL,
      supportBigNumbers: true,
    });
  }

  /**
   * 쿼리 처리 함수
   * @param sql SQL구문
   * @param params 쿼리파라미터 배열
   */
  public async query(sql: string, params?: any[]): Promise<any> {
    const conn = await this.pool.getConnection();
    const [rows] = await conn.query(sql, params);

    conn.release();
    // 필요시 에러처리 등 추가
    return rows;
  }

  /**
   * 트랜잭션 쿼리 처리 함수
   * @param cb connection을 인수로 받는 트랜잭션 처리 콜백 함수입니다. 커넥션을 통해 쿼리를 진행하고, 해당 변경 내용을 데이터베이스에 반영시키려면 conn.commit() 을 호출해야 합니다.
   */
  public async transactionQuery<R = any>(cb: (conn: Connection) => Promise<R>) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await cb(conn);
      return result;
    } catch (err) {
      conn.rollback();
      console.error('[FirstmallDbService] Transaction Query Err - ', err);
      throw new InternalServerErrorException();
    } finally {
      conn.release();
    }
  }
}
