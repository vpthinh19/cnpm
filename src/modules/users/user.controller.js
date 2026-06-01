// Tầng controller M1 — quản lý tài khoản (Admin).
const service = require('./user.service');
const { ok, created } = require('../../utils/response');

async function list(req, res) {
  const { RoleID, Status, q } = req.query;
  const data = await service.LayDanhSach({ RoleID, Status, q });
  return ok(res, data);
}

async function detail(req, res) {
  const data = await service.LayChiTiet(req.params.id);
  return ok(res, data);
}

async function create(req, res) {
  const data = await service.TaoTaiKhoan(req.body || {});
  return created(res, data, 'Tạo tài khoản thành công');
}

async function update(req, res) {
  const { FullName, RoleID } = req.body || {};
  const data = await service.CapNhatTaiKhoan(req.params.id, { FullName, RoleID });
  return ok(res, data, 'Cập nhật thành công');
}

async function lock(req, res) {
  const data = await service.Khoa(req.params.id, req.user.UserID);
  return ok(res, data, 'Đã khóa tài khoản');
}

async function unlock(req, res) {
  const data = await service.MoKhoa(req.params.id);
  return ok(res, data, 'Đã mở khóa tài khoản');
}

async function resetPassword(req, res) {
  const { NewPassword } = req.body || {};
  await service.DatLaiMatKhau(req.params.id, NewPassword);
  return ok(res, null, 'Đã đặt lại mật khẩu');
}

module.exports = { list, detail, create, update, lock, unlock, resetPassword };
