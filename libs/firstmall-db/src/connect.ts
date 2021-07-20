import { createPool } from 'mysql2/promise';

const pool = createPool({
  uri: process.env.FIRSTMALL_DATABASE_URL,
});

console.log(pool);

export default pool;
