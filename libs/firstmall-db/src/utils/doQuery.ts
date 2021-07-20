import pool from '../connect';

export default async function doQuery<ResultType = any>(sql: string, params?: any[]): Promise<any> {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(sql, params).catch(err => {
    throw err;
  });

  connection.release();
  return rows;
}
