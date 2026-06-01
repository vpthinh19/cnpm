// Tầng controller M3 — thực đơn.
const service = require('./monan.service');
const { ok, created } = require('../../utils/response');

async function list(req, res) {
  const { LoaiMon, TrangThai, q } = req.query;
  return ok(res, await service.LayDanhSach({ LoaiMon, TrangThai, q }));
}

async function detail(req, res) {
  return ok(res, await service.LayChiTiet(req.params.id));
}

async function create(req, res) {
  const { MaSanPham, TenMon, LoaiMon, DonGia, MoTa } = req.body || {};
  return created(res, await service.TaoMon({ MaSanPham, TenMon, LoaiMon, DonGia, MoTa }), 'Thêm món thành công');
}

async function update(req, res) {
  const { TenMon, LoaiMon, DonGia, MoTa } = req.body || {};
  return ok(res, await service.CapNhatMon(req.params.id, { TenMon, LoaiMon, DonGia, MoTa }), 'Cập nhật thành công');
}

async function changeStatus(req, res) {
  const { TrangThai } = req.body || {};
  return ok(res, await service.DoiTrangThai(req.params.id, TrangThai), 'Đã đổi trạng thái món');
}

async function remove(req, res) {
  await service.XoaMon(req.params.id);
  return ok(res, null, 'Đã xóa món');
}

module.exports = { list, detail, create, update, changeStatus, remove };
