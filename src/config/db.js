// Kết nối PostgreSQL qua driver pg (thuần JS, không cần build tools).
// Cung cấp:
//   - pool        : connection pool dùng chung.
//   - query(text, params) : chạy 1 câu lệnh, trả pg Result (rows giữ key PascalCase).
//   - getClient() : lấy client riêng để chạy GIAO_DỊCH (BEGIN/COMMIT/ROLLBACK).
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

function getClient() {
  return pool.connect();
}

module.exports = { pool, query, getClient };
