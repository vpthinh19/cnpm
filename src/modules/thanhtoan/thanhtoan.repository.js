// Tầng repository M6 — "HoaDon" + "ChiTietHoaDon" (đọc order qua orderRepo ở service).
const { query, q } = require('../../config/db');

const HD_COLS = `"HoaDonID", "MaHoaDon", "PhieuOrderID", "MaBanSnapshot", "NhanVienThuNganID",
  "TongTienMon", "TyLeVat", "TienVat", "TongThanhToan", "HinhThucTT", "TienKhachDua", "TienThua",
  "MaGiaoDich", "ThoiGianTao", "SoLanIn"`;

// STT hóa đơn trong ngày hôm nay (dùng sinh MaHoaDon, trong transaction).
async function DemHoaDonTrongNgay(client = null) {
  const result = await q(client, `SELECT COUNT(*)::int AS n FROM "HoaDon" WHERE "ThoiGianTao"::date = CURRENT_DATE`);
  return result.rows[0].n;
}

async function ThemHoaDon(data, client = null) {
  const {
    MaHoaDon, PhieuOrderID, MaBanSnapshot, NhanVienThuNganID, TongTienMon, TyLeVat, TienVat,
    TongThanhToan, HinhThucTT, TienKhachDua, TienThua, MaGiaoDich,
  } = data;
  const result = await q(
    client,
    `INSERT INTO "HoaDon"
       ("MaHoaDon", "PhieuOrderID", "MaBanSnapshot", "NhanVienThuNganID", "TongTienMon", "TyLeVat",
        "TienVat", "TongThanhToan", "HinhThucTT", "TienKhachDua", "TienThua", "MaGiaoDich", "SoLanIn")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, 0)
     RETURNING ${HD_COLS}`,
    [MaHoaDon, PhieuOrderID, MaBanSnapshot, NhanVienThuNganID, TongTienMon, TyLeVat, TienVat,
      TongThanhToan, HinhThucTT, TienKhachDua ?? null, TienThua, MaGiaoDich ?? null]
  );
  return result.rows[0];
}

async function ThemChiTietHoaDon({ HoaDonID, MonAnID, TenMon, SoLuong, DonGia }, client = null) {
  await q(
    client,
    `INSERT INTO "ChiTietHoaDon" ("HoaDonID", "MonAnID", "TenMon", "SoLuong", "DonGia")
     VALUES ($1, $2, $3, $4, $5)`,
    [HoaDonID, MonAnID, TenMon, SoLuong, DonGia]
  );
}

async function TimHoaDonTheoID(hoaDonID, client = null) {
  const result = await q(client, `SELECT ${HD_COLS} FROM "HoaDon" WHERE "HoaDonID" = $1`, [hoaDonID]);
  return result.rows[0] || null;
}

async function LayChiTietHoaDon(hoaDonID, client = null) {
  const result = await q(
    client,
    `SELECT "HoaDonID", "MonAnID", "TenMon", "SoLuong", "DonGia", "ThanhTien"
     FROM "ChiTietHoaDon" WHERE "HoaDonID" = $1 ORDER BY "MonAnID"`,
    [hoaDonID]
  );
  return result.rows;
}

async function TangSoLanIn(hoaDonID, client = null) {
  const result = await q(
    client,
    'UPDATE "HoaDon" SET "SoLanIn" = "SoLanIn" + 1 WHERE "HoaDonID" = $1 RETURNING "SoLanIn"',
    [hoaDonID]
  );
  return result.rows[0] ? result.rows[0].SoLanIn : null;
}

async function DanhSachHoaDon({ TuNgay, DenNgay, MaHoaDon, MaBan } = {}) {
  const dk = [];
  const params = [];
  if (TuNgay) {
    params.push(TuNgay);
    dk.push(`"ThoiGianTao"::date >= $${params.length}`);
  }
  if (DenNgay) {
    params.push(DenNgay);
    dk.push(`"ThoiGianTao"::date <= $${params.length}`);
  }
  if (MaHoaDon) {
    params.push(`%${MaHoaDon}%`);
    dk.push(`"MaHoaDon" ILIKE $${params.length}`);
  }
  if (MaBan) {
    params.push(MaBan);
    dk.push(`"MaBanSnapshot" = $${params.length}`);
  }
  const where = dk.length ? `WHERE ${dk.join(' AND ')}` : '';
  const result = await query(`SELECT ${HD_COLS} FROM "HoaDon" ${where} ORDER BY "ThoiGianTao" DESC`, params);
  return result.rows;
}

// Báo cáo doanh thu (TN_BM1): danh sách HĐ trong kỳ + tổng.
async function BaoCaoDoanhThu({ TuNgay, DenNgay }) {
  const result = await query(
    `SELECT "MaHoaDon", "ThoiGianTao", "MaBanSnapshot", "TongThanhToan", "HinhThucTT"
     FROM "HoaDon"
     WHERE "ThoiGianTao"::date >= $1 AND "ThoiGianTao"::date <= $2
     ORDER BY "ThoiGianTao"`,
    [TuNgay, DenNgay]
  );
  const TongDoanhThu = result.rows.reduce((s, r) => s + Number(r.TongThanhToan), 0);
  return { DanhSach: result.rows, TongDoanhThu };
}

module.exports = {
  DemHoaDonTrongNgay,
  ThemHoaDon,
  ThemChiTietHoaDon,
  TimHoaDonTheoID,
  LayChiTietHoaDon,
  TangSoLanIn,
  DanhSachHoaDon,
  BaoCaoDoanhThu,
};
