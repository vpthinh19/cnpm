// Tầng service M8 — Báo cáo tổng hợp (pseudocode §5.7, DFD §7.5.4, QL_BM4).
const repo = require('./baocao.repository');
const khoRepo = require('../kho/kho.repository'); // C. cảnh báo tồn (đọc lại NVL ≤ định mức)
const { TOP_N_BAO_CAO } = require('../../config/constants');
const ApiError = require('../../utils/ApiError');

async function BaoCaoTongHop({ TuNgay, DenNgay }) {
  if (!TuNgay || !DenNgay) throw ApiError.validation('Thiếu TuNgay hoặc DenNgay');
  if (TuNgay > DenNgay) throw ApiError.validation('Khoảng ngày không hợp lệ');

  // A. Doanh thu
  const TheoNgay = await repo.DoanhThuTheoNgay(TuNgay, DenNgay);
  const TongDoanhThuKy = TheoNgay.reduce((s, r) => s + Number(r.Tong), 0);

  // B. Top món bán chạy
  const TopMon = await repo.TopMonBanChay(TuNgay, DenNgay, TOP_N_BAO_CAO);

  // C. Cảnh báo tồn
  const CanhBaoTon = await khoRepo.LayNvlDuoiDinhMuc();

  return {
    DoanhThu: { TheoNgay, TongDoanhThuKy },
    TopMon,
    CanhBaoTon,
  };
}

module.exports = { BaoCaoTongHop };
