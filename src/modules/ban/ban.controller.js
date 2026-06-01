// Tầng controller M2 — quản lý bàn.
const service = require('./ban.service');
const { ok, created } = require('../../utils/response');

async function list(req, res) {
  const { TrangThai, KhuVuc } = req.query;
  return ok(res, await service.LayDanhSach({ TrangThai, KhuVuc }));
}

async function detail(req, res) {
  return ok(res, await service.LayChiTiet(req.params.id));
}

async function create(req, res) {
  const { MaBan, KhuVuc, SucChua, GhiChu } = req.body || {};
  return created(res, await service.TaoBan({ MaBan, KhuVuc, SucChua, GhiChu }), 'Thêm bàn thành công');
}

async function update(req, res) {
  const { MaBan, KhuVuc, SucChua, GhiChu } = req.body || {};
  return ok(res, await service.CapNhatBan(req.params.id, { MaBan, KhuVuc, SucChua, GhiChu }), 'Cập nhật thành công');
}

async function remove(req, res) {
  await service.XoaBan(req.params.id);
  return ok(res, null, 'Đã xóa bàn');
}

module.exports = { list, detail, create, update, remove };
