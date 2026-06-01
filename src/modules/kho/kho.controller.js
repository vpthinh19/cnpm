// Tầng controller M7 — Kho.
const service = require('./kho.service');
const { ok, created } = require('../../utils/response');

/* NCC */
async function listNCC(req, res) {
  return ok(res, await service.LayDanhSachNCC());
}
async function createNCC(req, res) {
  const { TenNCC, SoDienThoai, DiaChi } = req.body || {};
  return created(res, await service.TaoNCC({ TenNCC, SoDienThoai, DiaChi }), 'Thêm nhà cung cấp thành công');
}
async function updateNCC(req, res) {
  const { TenNCC, SoDienThoai, DiaChi } = req.body || {};
  return ok(res, await service.CapNhatNCC(req.params.id, { TenNCC, SoDienThoai, DiaChi }), 'Cập nhật thành công');
}
async function removeNCC(req, res) {
  await service.XoaNCC(req.params.id);
  return ok(res, null, 'Đã xóa nhà cung cấp');
}

/* NVL */
async function listNVL(req, res) {
  return ok(res, await service.LayDanhSachNVL({ q: req.query.q }));
}
async function createNVL(req, res) {
  const { TenNVL, DonViTinh, DinhMucToiThieu } = req.body || {};
  return created(res, await service.TaoNVL({ TenNVL, DonViTinh, DinhMucToiThieu }), 'Thêm nguyên liệu thành công');
}
async function updateNVL(req, res) {
  const { TenNVL, DonViTinh, DinhMucToiThieu } = req.body || {};
  return ok(res, await service.CapNhatNVL(req.params.id, { TenNVL, DonViTinh, DinhMucToiThieu }), 'Cập nhật thành công');
}
async function removeNVL(req, res) {
  await service.XoaNVL(req.params.id);
  return ok(res, null, 'Đã xóa nguyên liệu');
}

/* Nhập */
async function createNhap(req, res) {
  const { NhaCungCapID, NgayNhap, GhiChu, ChiTiet } = req.body || {};
  return created(res, await service.LapPhieuNhapKho({ NhaCungCapID, NgayNhap, GhiChu, ChiTiet }, req.user.UserID), 'Lập phiếu nhập thành công');
}
async function listNhap(req, res) {
  const { TuNgay, DenNgay, NhaCungCapID } = req.query;
  return ok(res, await service.LayDanhSachNhap({ TuNgay, DenNgay, NhaCungCapID }));
}
async function detailNhap(req, res) {
  return ok(res, await service.LayChiTietPhieuNhap(req.params.id));
}

/* Xuất */
async function createXuat(req, res) {
  const { NgayXuat, GhiChu, ChiTiet } = req.body || {};
  return created(res, await service.LapPhieuXuatKho({ NgayXuat, GhiChu, ChiTiet }, req.user.UserID), 'Lập phiếu xuất thành công');
}
async function listXuat(req, res) {
  const { TuNgay, DenNgay } = req.query;
  return ok(res, await service.LayDanhSachXuat({ TuNgay, DenNgay }));
}
async function detailXuat(req, res) {
  return ok(res, await service.LayChiTietPhieuXuat(req.params.id));
}

/* Báo cáo */
async function baoCaoTon(req, res) {
  const { TuNgay, DenNgay } = req.query;
  return ok(res, await service.BaoCaoTon({ TuNgay, DenNgay }));
}
async function baoCaoNhap(req, res) {
  const { TuNgay, DenNgay, NhaCungCapID } = req.query;
  return ok(res, await service.BaoCaoNhap({ TuNgay, DenNgay, NhaCungCapID }));
}
async function baoCaoXuat(req, res) {
  const { TuNgay, DenNgay } = req.query;
  return ok(res, await service.BaoCaoXuat({ TuNgay, DenNgay }));
}

module.exports = {
  listNCC, createNCC, updateNCC, removeNCC,
  listNVL, createNVL, updateNVL, removeNVL,
  createNhap, listNhap, detailNhap,
  createXuat, listXuat, detailXuat,
  baoCaoTon, baoCaoNhap, baoCaoXuat,
};
