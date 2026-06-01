// Tầng repository M5 — bảng "PhieuOrder" + "ChiTietOrder" (đọc "MonAn", "Ban").
const { query, q } = require('../../config/db');

const ORDER_COLS = '"PhieuOrderID", "BanID", "NhanVienPhucVuID", "ThoiGianTao", "TrangThai", "TongTamTinh"';

// Dòng món kèm thông tin món (dùng cho chi tiết order + bảng Bếp/Phục vụ).
const DONG_JOIN = `
  SELECT co."PhieuOrderID", co."SoDong", co."MonAnID", m."TenMon", m."LoaiMon",
         co."SoLuong", co."DonGia", co."ThanhTien", co."GhiChu", co."TrangThai",
         co."ThoiGianTao", co."ThoiGianChot", co."ThoiGianXong", co."ThoiGianPhucVu", co."NhanVienXacNhanID"
  FROM "ChiTietOrder" co JOIN "MonAn" m ON m."MonAnID" = co."MonAnID"`;

/* ---------- PhieuOrder ---------- */

async function DanhSachOrder({ TrangThai, BanID } = {}) {
  const dieuKien = [];
  const params = [];
  if (TrangThai) {
    params.push(TrangThai);
    dieuKien.push(`"TrangThai" = $${params.length}`);
  }
  if (BanID) {
    params.push(BanID);
    dieuKien.push(`"BanID" = $${params.length}`);
  }
  const where = dieuKien.length ? `WHERE ${dieuKien.join(' AND ')}` : '';
  const result = await query(`SELECT ${ORDER_COLS} FROM "PhieuOrder" ${where} ORDER BY "PhieuOrderID" DESC`, params);
  return result.rows;
}

async function TimOrder(phieuOrderID, client = null) {
  const result = await q(client, `SELECT ${ORDER_COLS} FROM "PhieuOrder" WHERE "PhieuOrderID" = $1`, [phieuOrderID]);
  return result.rows[0] || null;
}

async function LayOrderDangPhucVuTheoBan(banID, client = null) {
  const result = await q(
    client,
    `SELECT ${ORDER_COLS} FROM "PhieuOrder" WHERE "BanID" = $1 AND "TrangThai" = 'DangPhucVu' ORDER BY "PhieuOrderID" DESC LIMIT 1`,
    [banID]
  );
  return result.rows[0] || null;
}

async function CoOrderDangPhucVu(banID, client = null) {
  return (await LayOrderDangPhucVuTheoBan(banID, client)) !== null;
}

async function ThemOrder({ BanID, NhanVienPhucVuID }, client = null) {
  const result = await q(
    client,
    `INSERT INTO "PhieuOrder" ("BanID", "NhanVienPhucVuID", "TrangThai", "TongTamTinh")
     VALUES ($1, $2, 'DangPhucVu', 0) RETURNING ${ORDER_COLS}`,
    [BanID, NhanVienPhucVuID]
  );
  return result.rows[0];
}

async function CapNhatTrangThaiOrder(phieuOrderID, trangThai, client = null) {
  await q(client, 'UPDATE "PhieuOrder" SET "TrangThai" = $2 WHERE "PhieuOrderID" = $1', [phieuOrderID, trangThai]);
}

// Tính lại tổng tạm tính = SUM(ThanhTien) dòng chưa hủy; lưu vào PhieuOrder.
async function CapNhatTongTamTinh(phieuOrderID, client = null) {
  await q(
    client,
    `UPDATE "PhieuOrder" SET "TongTamTinh" = COALESCE(
        (SELECT SUM("ThanhTien") FROM "ChiTietOrder" WHERE "PhieuOrderID" = $1 AND "TrangThai" <> 'DaHuy'), 0)
     WHERE "PhieuOrderID" = $1`,
    [phieuOrderID]
  );
}

/* ---------- ChiTietOrder ---------- */

async function LayChiTietTheoOrder(phieuOrderID, { TrangThai } = {}, client = null) {
  const params = [phieuOrderID];
  let sql = `${DONG_JOIN} WHERE co."PhieuOrderID" = $1`;
  if (TrangThai) {
    params.push(TrangThai);
    sql += ` AND co."TrangThai" = $${params.length}`;
  }
  sql += ' ORDER BY co."SoDong"';
  const result = await q(client, sql, params);
  return result.rows;
}

async function LayMotDong(phieuOrderID, soDong, client = null) {
  const result = await q(client, `${DONG_JOIN} WHERE co."PhieuOrderID" = $1 AND co."SoDong" = $2`, [
    phieuOrderID,
    soDong,
  ]);
  return result.rows[0] || null;
}

async function MaxSoDong(phieuOrderID, client = null) {
  const result = await q(client, 'SELECT COALESCE(MAX("SoDong"), 0) AS m FROM "ChiTietOrder" WHERE "PhieuOrderID" = $1', [
    phieuOrderID,
  ]);
  return Number(result.rows[0].m);
}

async function ThemDong({ PhieuOrderID, SoDong, MonAnID, SoLuong, DonGia, GhiChu }, client = null) {
  await q(
    client,
    `INSERT INTO "ChiTietOrder" ("PhieuOrderID", "SoDong", "MonAnID", "SoLuong", "DonGia", "GhiChu", "TrangThai")
     VALUES ($1, $2, $3, $4, $5, $6, 'ChuaChot')`,
    [PhieuOrderID, SoDong, MonAnID, SoLuong, DonGia, GhiChu ?? null]
  );
}

async function SuaDong(phieuOrderID, soDong, { SoLuong, GhiChu }, client = null) {
  await q(
    client,
    'UPDATE "ChiTietOrder" SET "SoLuong" = $3, "GhiChu" = $4 WHERE "PhieuOrderID" = $1 AND "SoDong" = $2',
    [phieuOrderID, soDong, SoLuong, GhiChu ?? null]
  );
}

async function XoaDong(phieuOrderID, soDong, client = null) {
  await q(client, 'DELETE FROM "ChiTietOrder" WHERE "PhieuOrderID" = $1 AND "SoDong" = $2', [phieuOrderID, soDong]);
}

// --- Chuyển trạng thái dòng món (mốc thời gian dùng CURRENT_TIMESTAMP của DB) ---

// Chốt món ăn → vào hàng chờ Bếp.
async function ChotMonAn(phieuOrderID, soDong, client = null) {
  await q(
    client,
    `UPDATE "ChiTietOrder" SET "TrangThai" = 'ChoCheBien', "ThoiGianChot" = CURRENT_TIMESTAMP
     WHERE "PhieuOrderID" = $1 AND "SoDong" = $2`,
    [phieuOrderID, soDong]
  );
}

// Chốt đồ uống → phục vụ trực tiếp (bỏ qua Bếp).
async function ChotDoUong(phieuOrderID, soDong, nhanVienID, client = null) {
  await q(
    client,
    `UPDATE "ChiTietOrder"
       SET "TrangThai" = 'DaPhucVu', "ThoiGianChot" = CURRENT_TIMESTAMP,
           "ThoiGianPhucVu" = CURRENT_TIMESTAMP, "NhanVienXacNhanID" = $3
     WHERE "PhieuOrderID" = $1 AND "SoDong" = $2`,
    [phieuOrderID, soDong, nhanVienID]
  );
}

async function DanhDauDangCheBien(phieuOrderID, soDong, client = null) {
  await q(
    client,
    `UPDATE "ChiTietOrder" SET "TrangThai" = 'DangCheBien' WHERE "PhieuOrderID" = $1 AND "SoDong" = $2`,
    [phieuOrderID, soDong]
  );
}

async function DanhDauXong(phieuOrderID, soDong, client = null) {
  await q(
    client,
    `UPDATE "ChiTietOrder" SET "TrangThai" = 'DaXong', "ThoiGianXong" = CURRENT_TIMESTAMP
     WHERE "PhieuOrderID" = $1 AND "SoDong" = $2`,
    [phieuOrderID, soDong]
  );
}

async function DanhDauPhucVu(phieuOrderID, soDong, nhanVienID, client = null) {
  await q(
    client,
    `UPDATE "ChiTietOrder"
       SET "TrangThai" = 'DaPhucVu', "ThoiGianPhucVu" = CURRENT_TIMESTAMP, "NhanVienXacNhanID" = $3
     WHERE "PhieuOrderID" = $1 AND "SoDong" = $2`,
    [phieuOrderID, soDong, nhanVienID]
  );
}

async function DanhDauHuyDong(phieuOrderID, soDong, client = null) {
  await q(client, `UPDATE "ChiTietOrder" SET "TrangThai" = 'DaHuy' WHERE "PhieuOrderID" = $1 AND "SoDong" = $2`, [
    phieuOrderID,
    soDong,
  ]);
}

/* ---------- Bảng Bếp / Phục vụ (tra cứu) ---------- */

// Hàng chờ Bếp: chỉ món ăn ChoCheBien/DangCheBien, FIFO theo ThoiGianChot (B_BM2).
async function HangChoBep(client = null) {
  const result = await q(
    client,
    `SELECT co."PhieuOrderID", co."SoDong", b."MaBan", m."TenMon", co."SoLuong", co."GhiChu",
            co."TrangThai", co."ThoiGianChot"
     FROM "ChiTietOrder" co
       JOIN "MonAn" m ON m."MonAnID" = co."MonAnID"
       JOIN "PhieuOrder" po ON po."PhieuOrderID" = co."PhieuOrderID"
       JOIN "Ban" b ON b."BanID" = po."BanID"
     WHERE m."LoaiMon" = 'MonAn' AND co."TrangThai" IN ('ChoCheBien', 'DangCheBien')
     ORDER BY co."ThoiGianChot" ASC`
  );
  return result.rows;
}

// Món đã xong, chờ phục vụ (PV_BM4).
async function MonSanSangPhucVu(client = null) {
  const result = await q(
    client,
    `SELECT co."PhieuOrderID", co."SoDong", b."MaBan", m."TenMon", co."SoLuong", co."GhiChu", co."ThoiGianXong"
     FROM "ChiTietOrder" co
       JOIN "MonAn" m ON m."MonAnID" = co."MonAnID"
       JOIN "PhieuOrder" po ON po."PhieuOrderID" = co."PhieuOrderID"
       JOIN "Ban" b ON b."BanID" = po."BanID"
     WHERE co."TrangThai" = 'DaXong'
     ORDER BY co."ThoiGianXong" ASC`
  );
  return result.rows;
}

module.exports = {
  DanhSachOrder,
  TimOrder,
  LayOrderDangPhucVuTheoBan,
  CoOrderDangPhucVu,
  ThemOrder,
  CapNhatTrangThaiOrder,
  CapNhatTongTamTinh,
  LayChiTietTheoOrder,
  LayMotDong,
  MaxSoDong,
  ThemDong,
  SuaDong,
  XoaDong,
  ChotMonAn,
  ChotDoUong,
  DanhDauDangCheBien,
  DanhDauXong,
  DanhDauPhucVu,
  DanhDauHuyDong,
  HangChoBep,
  MonSanSangPhucVu,
};
