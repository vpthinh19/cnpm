// Tầng controller M8 — Báo cáo tổng hợp (Dashboard Admin).
const service = require('./baocao.service');
const { ok } = require('../../utils/response');

async function tongHop(req, res) {
  const { TuNgay, DenNgay } = req.query;
  return ok(res, await service.BaoCaoTongHop({ TuNgay, DenNgay }));
}

module.exports = { tongHop };
