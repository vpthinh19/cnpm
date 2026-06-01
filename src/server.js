// Điểm khởi động máy chủ. Kiểm tra kết nối CSDL trước rồi mới lắng nghe.
const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/db');

async function khoiDong() {
  try {
    const client = await pool.connect(); // kết nối thử (báo lỗi sớm nếu sai cấu hình)
    client.release();
    console.log('[DB] Kết nối PostgreSQL thành công');
    app.listen(env.PORT, () => {
      console.log(`[SERVER] Bò Né Mỹ Cảnh API chạy tại http://localhost:${env.PORT}/api/v1`);
    });
  } catch (err) {
    console.error('[DB] Không kết nối được PostgreSQL:', err.message);
    process.exit(1);
  }
}

khoiDong();
