// Tầng service M1 — quản lý tài khoản (DFD §7.5.3, QL_QĐ1, DESIGN §4.1.2).
const repo = require('./user.repository');
const { bam, kiemTraDoManh } = require('../../utils/password');
const { VAI_TRO } = require('../../config/constants');
const ApiError = require('../../utils/ApiError');

async function LayDanhSach(filter) {
  return repo.DanhSach(filter);
}

async function LayChiTiet(userID) {
  const u = await repo.TimTheoID(userID);
  if (!u) throw ApiError.notFound('Không tìm thấy tài khoản');
  return u;
}

async function TaoTaiKhoan({ Username, Password, FullName, RoleID }) {
  if (!Username || !FullName || !RoleID) {
    throw ApiError.validation('Thiếu thông tin: Username, FullName, RoleID');
  }
  if (!VAI_TRO.includes(RoleID)) {
    throw ApiError.validation('Vai trò không hợp lệ');
  }
  const loiMatKhau = kiemTraDoManh(Password);
  if (loiMatKhau) throw ApiError.ruleViolation(loiMatKhau);

  if (await repo.TonTaiUsername(Username)) {
    throw ApiError.duplicate('Tên đăng nhập đã tồn tại');
  }

  const PasswordHash = await bam(Password);
  return repo.Them({ Username, PasswordHash, FullName, RoleID });
}

async function CapNhatTaiKhoan(userID, { FullName, RoleID }) {
  if (!FullName || !RoleID) throw ApiError.validation('Thiếu họ tên hoặc vai trò');
  if (!VAI_TRO.includes(RoleID)) throw ApiError.validation('Vai trò không hợp lệ');

  const updated = await repo.CapNhatThongTin(userID, { FullName, RoleID });
  if (!updated) throw ApiError.notFound('Không tìm thấy tài khoản');
  return updated;
}

async function Khoa(userID, currentUserID) {
  // Không cho phép Admin tự khóa chính mình (QL_QĐ1).
  if (Number(userID) === Number(currentUserID)) {
    throw ApiError.ruleViolation('Không thể tự khóa tài khoản của chính mình');
  }
  await LayChiTiet(userID); // đảm bảo tồn tại
  await repo.DatTrangThai(userID, 'DaKhoa', false);
  return repo.TimTheoID(userID);
}

async function MoKhoa(userID) {
  await LayChiTiet(userID);
  await repo.DatTrangThai(userID, 'HoatDong', true); // reset FailedLoginCount
  return repo.TimTheoID(userID);
}

async function DatLaiMatKhau(userID, newPassword) {
  await LayChiTiet(userID);
  const loi = kiemTraDoManh(newPassword);
  if (loi) throw ApiError.ruleViolation(loi);
  const hash = await bam(newPassword);
  await repo.DatLaiMatKhau(userID, hash);
}

module.exports = {
  LayDanhSach,
  LayChiTiet,
  TaoTaiKhoan,
  CapNhatTaiKhoan,
  Khoa,
  MoKhoa,
  DatLaiMatKhau,
};
