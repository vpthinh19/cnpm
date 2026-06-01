// Kết nối PostgreSQL qua driver pg (thuần JS, không cần build tools).
// Cung cấp:
//   - pool        : connection pool dùng chung.
//   - query(text, params)        : chạy 1 câu lệnh trên pool (rows giữ key PascalCase).
//   - q(client, text, params)    : chạy trên client (trong transaction) hoặc pool nếu client null.
//   - withTransaction(fn)        : GIAO_DỊCH — BEGIN → fn(client) → COMMIT, lỗi thì ROLLBACK.
const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  database: env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Tham số dùng kiểu $1, $2... ; pg trả result.rows (mảng object, key = tên cột).
function query(text, params) {
  return pool.query(text, params);
}

// Chạy câu lệnh trên client (nếu đang trong transaction) hoặc pool.
function q(client, text, params) {
  return (client || pool).query(text, params);
}

function getClient() {
  return pool.connect();
}

// GIAO_DỊCH §5.0: atomic; mọi NÉM_LỖI/lỗi bên trong → ROLLBACK tự động.
async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch (_) {
      /* bỏ qua lỗi rollback */
    }
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, q, getClient, withTransaction };
