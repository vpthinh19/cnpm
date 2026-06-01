// Tầng repository M2 — bảng "Ban".
const { query } = require('../../config/db');

const COLS = '"BanID", "MaBan", "KhuVuc", "SucChua", "TrangThai", "GhiChu", "DangSuDung"';

// Chỉ liệt kê bàn đang sử dụng (DangSuDung = TRUE).
async function DanhSach({ TrangThai, KhuVuc } = {}) {
  const dieuKien = ['"DangSuDung" = TRUE'];
  const params = [];
  if (TrangThai) {
    params.push(TrangThai);
    dieuKien.push(`"TrangThai" = $${params.length}`);
  }
  if (KhuVuc) {
    params.push(KhuVuc);
    dieuKien.push(`"KhuVuc" = $${params.length}`);
  }
  const result = await query(
    `SELECT ${COLS} FROM "Ban" WHERE ${dieuKien.join(' AND ')} ORDER BY "BanID"`,
    params
  );
  return result.rows;
}

async function TimTheoID(banID) {
  const result = await query(`SELECT ${COLS} FROM "Ban" WHERE "BanID" = $1`, [banID]);
  return result.rows[0] || null;
}

// Kiểm tra trùng MaBan (bỏ qua chính bản ghi banID nếu có — dùng khi sửa).
async function TonTaiMaBan(maBan, boQuaID = null) {
  const params = [maBan];
  let sql = 'SELECT 1 FROM "Ban" WHERE "MaBan" = $1';
  if (boQuaID) {
    params.push(boQuaID);
    sql += ` AND "BanID" <> $${params.length}`;
  }
  const result = await query(sql, params);
  return result.rows.length > 0;
}

async function Them({ MaBan, KhuVuc, SucChua, GhiChu }) {
  const result = await query(
    `INSERT INTO "Ban" ("MaBan", "KhuVuc", "SucChua", "GhiChu")
     VALUES ($1, $2, $3, $4)
     RETURNING ${COLS}`,
    [MaBan, KhuVuc, SucChua, GhiChu ?? null]
  );
  return result.rows[0];
}

async function CapNhat(banID, { MaBan, KhuVuc, SucChua, GhiChu }) {
  const result = await query(
    `UPDATE "Ban" SET "MaBan" = $2, "KhuVuc" = $3, "SucChua" = $4, "GhiChu" = $5
     WHERE "BanID" = $1
     RETURNING ${COLS}`,
    [banID, MaBan, KhuVuc, SucChua, GhiChu ?? null]
  );
  return result.rows[0] || null;
}

async function XoaMem(banID) {
  await query('UPDATE "Ban" SET "DangSuDung" = FALSE WHERE "BanID" = $1', [banID]);
}

module.exports = { DanhSach, TimTheoID, TonTaiMaBan, Them, CapNhat, XoaMem };
