// Tầng controller M6 — Thanh toán / Hóa đơn / Báo cáo doanh thu.
const service = require('./thanhtoan.service');
const { ok, created } = require('../../utils/response');

async function xemTruoc(req, res) {
  return ok(res, await service.XemTruoc(req.params.PhieuOrderID));
}

async function thanhToan(req, res) {
  const data = await service.XuLyThanhToan(req.body || {}, req.user.UserID);
  return created(res, data, 'Thanh toán thành công');
}

async function listHoaDon(req, res) {
  const { TuNgay, DenNgay, MaHoaDon, MaBan } = req.query;
  return ok(res, await service.LayDanhSachHoaDon({ TuNgay, DenNgay, MaHoaDon, MaBan }));
}

async function detailHoaDon(req, res) {
  return ok(res, await service.LayChiTietHoaDon(req.params.id));
}

async function inHoaDon(req, res) {
  return ok(res, await service.InHoaDon(req.params.id), 'Đã ghi nhận in hóa đơn');
}

async function baoCaoDoanhThu(req, res) {
  const { TuNgay, DenNgay } = req.query;
  return ok(res, await service.BaoCaoDoanhThu({ TuNgay, DenNgay }));
}

module.exports = { xemTruoc, thanhToan, listHoaDon, detailHoaDon, inHoaDon, baoCaoDoanhThu };
