import doQuery from '../utils/doQuery';

export async function firstmallDb(): Promise<any> {
  const sql = `select * from fm_goods order by regist_date DESC limit 1`;
  const result = await doQuery(sql);
  return result;
}
