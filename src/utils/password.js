// Tiện ích mật khẩu: băm/so khớp bcrypt + kiểm tra độ mạnh (QL_QĐ1).
const bcrypt = require('bcryptjs');

const COST = 10; // khớp seed database.sql ($2b$10$...)

async function bam(matKhauTho) {
  return bcrypt.hash(matKhauTho, COST);
}

async function soKhop(matKhauTho, hash) {
  return bcrypt.compare(matKhauTho, hash);
}

// QL_QĐ1: ≥ 8 ký tự, có cả chữ và số. Trả null nếu hợp lệ, hoặc thông điệp lỗi.
function kiemTraDoManh(matKhau) {
  if (typeof matKhau !== 'string' || matKhau.length < 8) {
    return 'Mật khẩu phải có ít nhất 8 ký tự';
  }
  if (!/[A-Za-z]/.test(matKhau) || !/[0-9]/.test(matKhau)) {
    return 'Mật khẩu phải có cả chữ và số';
  }
  return null;
}

module.exports = { bam, soKhop, kiemTraDoManh };
