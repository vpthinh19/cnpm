// Nạp biến môi trường từ .env và xuất ra cấu hình đã chuẩn hóa.
require('dotenv').config();

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'bone-mycanh-dev-secret',

  // PostgreSQL
  PGHOST: process.env.PGHOST || 'localhost',
  PGPORT: parseInt(process.env.PGPORT, 10) || 5432,
  PGUSER: process.env.PGUSER || 'postgres',
  PGPASSWORD: process.env.PGPASSWORD || '',
  PGDATABASE: process.env.PGDATABASE || 'BoNeMyCanh',
};
