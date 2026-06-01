// Tầng repository M8 — Báo cáo tổng hợp (chỉ đọc cross-module: HoaDon, ChiTietHoaDon, MonAn).
const { query } = require('../../config/db');

// A. Doanh thu theo ngày + hình thức thanh toán (gộp HoaDon trong kỳ).
async function DoanhThuTheoNgay(TuNgay, DenNgay) {
  const r = await query(
    `SELECT TO_CHAR("ThoiGianTao"::date, 'YYYY-MM-DD') AS "Ngay",
            COUNT(*)::int AS "SoHoaDon",
            SUM("TongThanhToan") AS "Tong",
            SUM(CASE WHEN "HinhThucTT" = 'TienMat' THEN "TongThanhToan" ELSE 0 END) AS "TienMat",
            SUM(CASE WHEN "HinhThucTT" = 'ChuyenKhoan' THEN "TongThanhToan" ELSE 0 END) AS "ChuyenKhoan"
     FROM "HoaDon"
     WHERE "ThoiGianTao"::date >= $1 AND "ThoiGianTao"::date <= $2
     GROUP BY "ThoiGianTao"::date
     ORDER BY "ThoiGianTao"::date`,
    [TuNgay, DenNgay]
  );
  return r.rows;
}

// B. Top món bán chạy (nguồn ChiTietHoaDon snapshot của HĐ trong kỳ).
async function TopMonBanChay(TuNgay, DenNgay, topN) {
  const r = await query(
    `SELECT m."MonAnID", m."TenMon",
            SUM(ct."SoLuong")::int AS "SoLuongBan",
            SUM(ct."ThanhTien") AS "DoanhThu"
     FROM "HoaDon" hd
       JOIN "ChiTietHoaDon" ct ON ct."HoaDonID" = hd."HoaDonID"
       JOIN "MonAn" m ON m."MonAnID" = ct."MonAnID"
     WHERE hd."ThoiGianTao"::date >= $1 AND hd."ThoiGianTao"::date <= $2
     GROUP BY m."MonAnID", m."TenMon"
     ORDER BY "SoLuongBan" DESC, "DoanhThu" DESC
     LIMIT $3`,
    [TuNgay, DenNgay, topN]
  );
  return r.rows;
}

module.exports = { DoanhThuTheoNgay, TopMonBanChay };
