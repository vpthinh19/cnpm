// Tầng repository M4 — bảng "PhieuDatBan".
const { query, q } = require('../../config/db');

const COLS = `"PhieuDatBanID", "BanID", "TenKhach", "SoDienThoai", "SoNguoi", "ThoiGianDat",
  "HinhThucDat", "GhiChu", "NhanVienTiepNhanID", "TrangThai", "ThoiGianTao", "ThoiGianNhanBan", "ThoiGianHuy"`;

async function DanhSach({ TrangThai, Ngay, q: tuKhoa } = {}) {
  const dieuKien = [];
  const params = [];
  if (TrangThai) {
    params.push(TrangThai);
    dieuKien.push(`"TrangThai" = $${params.length}`);
  }
  if (Ngay) {
    params.push(Ngay);
    dieuKien.push(`"ThoiGianDat"::date = $${params.length}`);
  }
  if (tuKhoa) {
    params.push(`%${tuKhoa}%`);
    const i = params.length;
    dieuKien.push(
      `("SoDienThoai" ILIKE $${i} OR "TenKhach" ILIKE $${i} OR CAST("PhieuDatBanID" AS TEXT) ILIKE $${i})`
    );
  }
  const where = dieuKien.length ? `WHERE ${dieuKien.join(' AND ')}` : '';
  const result = await query(
    `SELECT ${COLS} FROM "PhieuDatBan" ${where} ORDER BY "ThoiGianDat" DESC`,
    params
  );
  return result.rows;
}

async function TimTheoID(phieuDatBanID, client = null) {
  const result = await q(client, `SELECT ${COLS} FROM "PhieuDatBan" WHERE "PhieuDatBanID" = $1`, [
    phieuDatBanID,
  ]);
  return result.rows[0] || null;
}

async function Them(data, client = null) {
  const { BanID, TenKhach, SoDienThoai, SoNguoi, ThoiGianDat, HinhThucDat, GhiChu, NhanVienTiepNhanID } = data;
  const result = await q(
    client,
    `INSERT INTO "PhieuDatBan"
       ("BanID", "TenKhach", "SoDienThoai", "SoNguoi", "ThoiGianDat", "HinhThucDat", "GhiChu", "NhanVienTiepNhanID", "TrangThai")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'DaDat')
     RETURNING ${COLS}`,
    [BanID, TenKhach, SoDienThoai, SoNguoi, ThoiGianDat, HinhThucDat, GhiChu ?? null, NhanVienTiepNhanID]
  );
  return result.rows[0];
}

async function DanhDauNhanBan(phieuDatBanID, client = null) {
  const result = await q(
    client,
    `UPDATE "PhieuDatBan" SET "TrangThai" = 'DaNhanBan', "ThoiGianNhanBan" = CURRENT_TIMESTAMP
     WHERE "PhieuDatBanID" = $1 RETURNING ${COLS}`,
    [phieuDatBanID]
  );
  return result.rows[0];
}

async function DanhDauHuy(phieuDatBanID, client = null) {
  const result = await q(
    client,
    `UPDATE "PhieuDatBan" SET "TrangThai" = 'DaHuy', "ThoiGianHuy" = CURRENT_TIMESTAMP
     WHERE "PhieuDatBanID" = $1 RETURNING ${COLS}`,
    [phieuDatBanID]
  );
  return result.rows[0];
}

module.exports = { DanhSach, TimTheoID, Them, DanhDauNhanBan, DanhDauHuy };
