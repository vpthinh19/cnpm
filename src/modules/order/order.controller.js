// Tầng controller M5 — Order + Bếp.
const service = require('./order.service');
const { ok, created } = require('../../utils/response');

/* --- Tra cứu --- */
async function list(req, res) {
  const { TrangThai, BanID } = req.query;
  return ok(res, await service.LayDanhSach({ TrangThai, BanID }));
}
async function detail(req, res) {
  return ok(res, await service.LayChiTietOrder(req.params.PhieuOrderID));
}
async function dangPhucVuTheoBan(req, res) {
  return ok(res, await service.LayOrderDangPhucVuTheoBan(req.params.BanID));
}
async function hangChoBep(req, res) {
  return ok(res, await service.HangChoBep());
}
async function sanSangPhucVu(req, res) {
  return ok(res, await service.MonSanSangPhucVu());
}
async function phieuBep(req, res) {
  return ok(res, await service.LayPhieuBep(req.params.PhieuOrderID));
}

/* --- Gọi món --- */
async function create(req, res) {
  const { BanID, ChiTiet } = req.body || {};
  return created(res, await service.MoOrder(BanID, ChiTiet, req.user.UserID), 'Mở order thành công');
}
async function themDong(req, res) {
  const { ChiTiet } = req.body || {};
  return created(res, await service.ThemDongMon(req.params.PhieuOrderID, ChiTiet), 'Đã thêm món');
}
async function suaDong(req, res) {
  const { SoLuong, GhiChu } = req.body || {};
  return ok(res, await service.SuaDongMon(req.params.PhieuOrderID, req.params.SoDong, { SoLuong, GhiChu }), 'Đã sửa dòng món');
}
async function xoaDong(req, res) {
  return ok(res, await service.XoaDongMon(req.params.PhieuOrderID, req.params.SoDong), 'Đã xóa dòng món');
}

/* --- Chốt bếp --- */
async function chot(req, res) {
  return ok(res, await service.ChotOrder(req.params.PhieuOrderID, req.user.UserID), 'Đã chốt order');
}

/* --- Bếp --- */
async function capNhatTrangThaiMon(req, res) {
  const { TrangThai } = req.body || {};
  return ok(res, await service.CapNhatTrangThaiMon(req.params.PhieuOrderID, req.params.SoDong, TrangThai), 'Đã cập nhật trạng thái món');
}

/* --- Phục vụ & hủy --- */
async function phucVuMon(req, res) {
  return ok(res, await service.PhucVuMon(req.params.PhieuOrderID, req.params.SoDong, req.user.UserID), 'Đã phục vụ món');
}
async function huyDong(req, res) {
  return ok(res, await service.HuyDongMon(req.params.PhieuOrderID, req.params.SoDong), 'Đã hủy dòng món');
}
async function huyOrder(req, res) {
  return ok(res, await service.HuyOrder(req.params.PhieuOrderID), 'Đã hủy order');
}

module.exports = {
  list,
  detail,
  dangPhucVuTheoBan,
  hangChoBep,
  sanSangPhucVu,
  phieuBep,
  create,
  themDong,
  suaDong,
  xoaDong,
  chot,
  capNhatTrangThaiMon,
  phucVuMon,
  huyDong,
  huyOrder,
};
