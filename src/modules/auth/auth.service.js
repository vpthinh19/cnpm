// Tầng service M1 — Đăng nhập (pseudocode DESIGN §5.2, DFD §7.6.1, QL_QĐ1).
const repo = require('./auth.repository');
const { soKhop } = require('../../utils/password');
const { kyToken } = require('../../utils/jwt');
const { SO_LAN_SAI_TOI_DA } = require('../../config/constants');
const ApiError = require('../../utils/ApiError');

async function DangNhap(tenDangNhap, matKhau) {
  if (!tenDangNhap || !matKhau) {
    throw ApiError.validation('Vui lòng nhập tên đăng nhập và mật khẩu');
  }

  const u = await repo.TimUserTheoUsername(tenDangNhap);
  // Không tiết lộ tài khoản có tồn tại hay không.
  if (!u) {
    throw ApiError.unauthorized('Tên đăng nhập hoặc mật khẩu không đúng');
  }
  if (u.Status === 'DaKhoa') {
    throw ApiError.unauthorized('Tài khoản đã bị khóa, liên hệ Admin');
  }

  const dung = await soKhop(matKhau, u.PasswordHash);
  if (!dung) {
    const soLanSai = u.FailedLoginCount + 1;
    const khoa = soLanSai >= SO_LAN_SAI_TOI_DA;
    await repo.CapNhatSauDangNhap(u.UserID, {
      FailedLoginCount: soLanSai,
      Status: khoa ? 'DaKhoa' : null,
    });
    throw ApiError.unauthorized('Tên đăng nhập hoặc mật khẩu không đúng');
  }

  // Đúng mật khẩu → reset số lần sai, cập nhật LastLoginAt.
  await repo.CapNhatSauDangNhap(u.UserID, { FailedLoginCount: 0, capNhatLastLogin: true });

  const token = kyToken({ UserID: u.UserID, RoleID: u.RoleID });
  return {
    token,
    user: { UserID: u.UserID, FullName: u.FullName, Username: u.Username, RoleID: u.RoleID },
  };
}

module.exports = { DangNhap };
