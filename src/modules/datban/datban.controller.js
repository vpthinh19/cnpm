// Tầng controller M4 — Đặt bàn.
const service = require('./datban.service');
const { ok, created } = require('../../utils/response');

async function list(req, res) {
  const { TrangThai, Ngay, q } = req.query;
  return ok(res, await service.LayDanhSach({ TrangThai, Ngay, q }));
}

async function detail(req, res) {
  return ok(res, await service.LayChiTiet(req.params.id));
}

async function create(req, res) {
  const data = await service.XuLyDatBan(req.body || {}, req.user.UserID);
  return created(res, data, 'Tiếp nhận đặt bàn thành công');
}

async function nhanBan(req, res) {
  return ok(res, await service.NhanBan(req.params.id), 'Đã nhận bàn');
}

async function huy(req, res) {
  return ok(res, await service.HuyDatBan(req.params.id), 'Đã hủy phiếu đặt');
}

module.exports = { list, detail, create, nhanBan, huy };
