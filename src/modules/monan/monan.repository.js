// Tầng repository M3 — bảng "MonAn".
const { query } = require('../../config/db');

const COLS = '"MonAnID", "MaMonAn", "TenMon", "LoaiMon", "DonGia", "TrangThai", "MoTa", "DangSuDung"';

// Chỉ liệt kê món đang kinh doanh (DangSuDung = TRUE).
async function DanhSach({ LoaiMon, TrangThai, q } = {}) {
  const dieuKien = ['"DangSuDung" = TRUE'];
  const params = [];
  if (LoaiMon) {
    params.push(LoaiMon);
    dieuKien.push(`"LoaiMon" = $${params.length}`);
  }
  if (TrangThai) {
    params.push(TrangThai);
    dieuKien.push(`"TrangThai" = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    dieuKien.push(`("TenMon" ILIKE $${params.length} OR "MaMonAn" ILIKE $${params.length})`);
  }
  const result = await query(
    `SELECT ${COLS} FROM "MonAn" WHERE ${dieuKien.join(' AND ')} ORDER BY "MonAnID"`,
    params
  );
  return result.rows;
}

async function TimTheoID(monAnID) {
  const result = await query(`SELECT ${COLS} FROM "MonAn" WHERE "MonAnID" = $1`, [monAnID]);
  return result.rows[0] || null;
}

async function TonTaiCot(cot, giaTri, boQuaID = null) {
  // cot ∈ {MaMonAn, TenMon} — kiểm soát nội bộ, an toàn với nháy kép.
  const params = [giaTri];
  let sql = `SELECT 1 FROM "MonAn" WHERE "${cot}" = $1`;
  if (boQuaID) {
    params.push(boQuaID);
    sql += ` AND "MonAnID" <> $${params.length}`;
  }
  const result = await query(sql, params);
  return result.rows.length > 0;
}

async function Them({ MaMonAn, TenMon, LoaiMon, DonGia, MoTa }) {
  const result = await query(
    `INSERT INTO "MonAn" ("MaMonAn", "TenMon", "LoaiMon", "DonGia", "MoTa")
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLS}`,
    [MaMonAn, TenMon, LoaiMon, DonGia, MoTa ?? null]
  );
  return result.rows[0];
}

async function CapNhat(monAnID, { TenMon, LoaiMon, DonGia, MoTa }) {
  const result = await query(
    `UPDATE "MonAn" SET "TenMon" = $2, "LoaiMon" = $3, "DonGia" = $4, "MoTa" = $5
     WHERE "MonAnID" = $1
     RETURNING ${COLS}`,
    [monAnID, TenMon, LoaiMon, DonGia, MoTa ?? null]
  );
  return result.rows[0] || null;
}

async function DoiTrangThai(monAnID, trangThai) {
  const result = await query(
    `UPDATE "MonAn" SET "TrangThai" = $2 WHERE "MonAnID" = $1 RETURNING ${COLS}`,
    [monAnID, trangThai]
  );
  return result.rows[0] || null;
}

async function XoaMem(monAnID) {
  await query('UPDATE "MonAn" SET "DangSuDung" = FALSE WHERE "MonAnID" = $1', [monAnID]);
}

module.exports = { DanhSach, TimTheoID, TonTaiCot, Them, CapNhat, DoiTrangThai, XoaMem };
