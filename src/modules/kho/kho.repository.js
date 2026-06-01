// Tầng repository M7 — Kho: NhaCungCap, NguyenLieu, PhieuNhapKho/ChiTiet, PhieuXuatKho/ChiTiet, báo cáo.
const { query, q } = require('../../config/db');

/* ===================== Nhà cung cấp ===================== */
const NCC_COLS = '"NhaCungCapID", "TenNCC", "SoDienThoai", "DiaChi", "DangSuDung"';

async function DanhSachNCC() {
  const r = await query(`SELECT ${NCC_COLS} FROM "NhaCungCap" WHERE "DangSuDung" = TRUE ORDER BY "NhaCungCapID"`);
  return r.rows;
}
async function TimNCC(id, client = null) {
  const r = await q(client, `SELECT ${NCC_COLS} FROM "NhaCungCap" WHERE "NhaCungCapID" = $1`, [id]);
  return r.rows[0] || null;
}
async function TonTaiTenNCC(ten, boQuaID = null) {
  const params = [ten];
  let sql = 'SELECT 1 FROM "NhaCungCap" WHERE "TenNCC" = $1';
  if (boQuaID) {
    params.push(boQuaID);
    sql += ` AND "NhaCungCapID" <> $${params.length}`;
  }
  return (await query(sql, params)).rows.length > 0;
}
async function ThemNCC({ TenNCC, SoDienThoai, DiaChi }) {
  const r = await query(
    `INSERT INTO "NhaCungCap" ("TenNCC", "SoDienThoai", "DiaChi") VALUES ($1,$2,$3) RETURNING ${NCC_COLS}`,
    [TenNCC, SoDienThoai ?? null, DiaChi ?? null]
  );
  return r.rows[0];
}
async function CapNhatNCC(id, { TenNCC, SoDienThoai, DiaChi }) {
  const r = await query(
    `UPDATE "NhaCungCap" SET "TenNCC"=$2, "SoDienThoai"=$3, "DiaChi"=$4 WHERE "NhaCungCapID"=$1 RETURNING ${NCC_COLS}`,
    [id, TenNCC, SoDienThoai ?? null, DiaChi ?? null]
  );
  return r.rows[0] || null;
}
async function XoaMemNCC(id) {
  await query('UPDATE "NhaCungCap" SET "DangSuDung" = FALSE WHERE "NhaCungCapID" = $1', [id]);
}

/* ===================== Nguyên liệu ===================== */
const NVL_COLS =
  '"NguyenLieuID", "TenNVL", "DonViTinh", "TonHienTai", "DinhMucToiThieu", "ThoiGianCapNhatTon", "DangSuDung"';

async function DanhSachNVL({ q: tuKhoa } = {}) {
  const params = [];
  let where = 'WHERE "DangSuDung" = TRUE';
  if (tuKhoa) {
    params.push(`%${tuKhoa}%`);
    where += ` AND "TenNVL" ILIKE $${params.length}`;
  }
  const r = await query(`SELECT ${NVL_COLS} FROM "NguyenLieu" ${where} ORDER BY "NguyenLieuID"`, params);
  return r.rows;
}
async function TimNVL(id, client = null) {
  const r = await q(client, `SELECT ${NVL_COLS} FROM "NguyenLieu" WHERE "NguyenLieuID" = $1`, [id]);
  return r.rows[0] || null;
}
async function TonTaiTenNVL(ten, boQuaID = null) {
  const params = [ten];
  let sql = 'SELECT 1 FROM "NguyenLieu" WHERE "TenNVL" = $1';
  if (boQuaID) {
    params.push(boQuaID);
    sql += ` AND "NguyenLieuID" <> $${params.length}`;
  }
  return (await query(sql, params)).rows.length > 0;
}
async function ThemNVL({ TenNVL, DonViTinh, DinhMucToiThieu }) {
  const r = await query(
    `INSERT INTO "NguyenLieu" ("TenNVL", "DonViTinh", "DinhMucToiThieu") VALUES ($1,$2,$3) RETURNING ${NVL_COLS}`,
    [TenNVL, DonViTinh, DinhMucToiThieu ?? 0]
  );
  return r.rows[0];
}
async function CapNhatNVL(id, { TenNVL, DonViTinh, DinhMucToiThieu }) {
  const r = await query(
    `UPDATE "NguyenLieu" SET "TenNVL"=$2, "DonViTinh"=$3, "DinhMucToiThieu"=$4
     WHERE "NguyenLieuID"=$1 RETURNING ${NVL_COLS}`,
    [id, TenNVL, DonViTinh, DinhMucToiThieu ?? 0]
  );
  return r.rows[0] || null;
}
async function XoaMemNVL(id) {
  await query('UPDATE "NguyenLieu" SET "DangSuDung" = FALSE WHERE "NguyenLieuID" = $1', [id]);
}

// Cộng tồn (nhập kho) — trong transaction.
async function CongTonKho(nvlID, soLuong, client = null) {
  await q(
    client,
    `UPDATE "NguyenLieu" SET "TonHienTai" = "TonHienTai" + $2, "ThoiGianCapNhatTon" = CURRENT_TIMESTAMP
     WHERE "NguyenLieuID" = $1`,
    [nvlID, soLuong]
  );
}

// Trừ tồn có kiểm tra (xuất kho) — chống xuất quá tồn; trả số dòng cập nhật (0 = thất bại).
async function TruTonKhoCoKiemTra(nvlID, soLuong, client = null) {
  const r = await q(
    client,
    `UPDATE "NguyenLieu" SET "TonHienTai" = "TonHienTai" - $2, "ThoiGianCapNhatTon" = CURRENT_TIMESTAMP
     WHERE "NguyenLieuID" = $1 AND "TonHienTai" >= $2`,
    [nvlID, soLuong]
  );
  return r.rowCount;
}

// NVL có tồn ≤ định mức (cảnh báo). Lọc theo danh sách id nếu truyền.
async function LayNvlDuoiDinhMuc(listIDs = null) {
  let sql = `SELECT "NguyenLieuID", "TenNVL", "DonViTinh", "TonHienTai", "DinhMucToiThieu"
             FROM "NguyenLieu" WHERE "DangSuDung" = TRUE AND "TonHienTai" <= "DinhMucToiThieu"`;
  const params = [];
  if (listIDs && listIDs.length) {
    params.push(listIDs);
    sql += ` AND "NguyenLieuID" = ANY($1)`;
  }
  return (await query(sql, params)).rows;
}

/* ===================== Phiếu nhập ===================== */
const PN_COLS =
  '"PhieuNhapKhoID", "MaPhieuNhap", "NhaCungCapID", "NhanVienLapID", "NgayNhap", "TongGiaTri", "GhiChu", "ThoiGianTao"';

async function DemPhieuNhapTrongNgay(ngayNhap, client = null) {
  const r = await q(client, 'SELECT COUNT(*)::int AS n FROM "PhieuNhapKho" WHERE "NgayNhap" = $1', [ngayNhap]);
  return r.rows[0].n;
}
async function ThemPhieuNhap(data, client = null) {
  const { MaPhieuNhap, NhaCungCapID, NhanVienLapID, NgayNhap, TongGiaTri, GhiChu } = data;
  const r = await q(
    client,
    `INSERT INTO "PhieuNhapKho" ("MaPhieuNhap","NhaCungCapID","NhanVienLapID","NgayNhap","TongGiaTri","GhiChu")
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${PN_COLS}`,
    [MaPhieuNhap, NhaCungCapID, NhanVienLapID, NgayNhap, TongGiaTri, GhiChu ?? null]
  );
  return r.rows[0];
}
async function ThemChiTietNhap({ PhieuNhapKhoID, NguyenLieuID, SoLuong, DonGia, GhiChu }, client = null) {
  await q(
    client,
    `INSERT INTO "ChiTietNhapKho" ("PhieuNhapKhoID","NguyenLieuID","SoLuong","DonGia","GhiChu")
     VALUES ($1,$2,$3,$4,$5)`,
    [PhieuNhapKhoID, NguyenLieuID, SoLuong, DonGia, GhiChu ?? null]
  );
}
async function DanhSachNhap({ TuNgay, DenNgay, NhaCungCapID } = {}) {
  const dk = [];
  const params = [];
  if (TuNgay) {
    params.push(TuNgay);
    dk.push(`"NgayNhap" >= $${params.length}`);
  }
  if (DenNgay) {
    params.push(DenNgay);
    dk.push(`"NgayNhap" <= $${params.length}`);
  }
  if (NhaCungCapID) {
    params.push(NhaCungCapID);
    dk.push(`"NhaCungCapID" = $${params.length}`);
  }
  const where = dk.length ? `WHERE ${dk.join(' AND ')}` : '';
  const r = await query(`SELECT ${PN_COLS} FROM "PhieuNhapKho" ${where} ORDER BY "NgayNhap" DESC, "PhieuNhapKhoID" DESC`, params);
  return r.rows;
}
async function TimPhieuNhap(id) {
  const r = await query(`SELECT ${PN_COLS} FROM "PhieuNhapKho" WHERE "PhieuNhapKhoID" = $1`, [id]);
  return r.rows[0] || null;
}
async function ChiTietNhapCuaPhieu(id) {
  const r = await query(
    `SELECT ct."NguyenLieuID", nl."TenNVL", nl."DonViTinh", ct."SoLuong", ct."DonGia", ct."ThanhTien", ct."GhiChu"
     FROM "ChiTietNhapKho" ct JOIN "NguyenLieu" nl ON nl."NguyenLieuID" = ct."NguyenLieuID"
     WHERE ct."PhieuNhapKhoID" = $1 ORDER BY ct."NguyenLieuID"`,
    [id]
  );
  return r.rows;
}

/* ===================== Phiếu xuất ===================== */
const PX_COLS = '"PhieuXuatKhoID", "MaPhieuXuat", "NhanVienLapID", "NgayXuat", "TongGiaTri", "GhiChu", "ThoiGianTao"';

async function DemPhieuXuatTrongNgay(ngayXuat, client = null) {
  const r = await q(client, 'SELECT COUNT(*)::int AS n FROM "PhieuXuatKho" WHERE "NgayXuat" = $1', [ngayXuat]);
  return r.rows[0].n;
}
async function ThemPhieuXuat(data, client = null) {
  const { MaPhieuXuat, NhanVienLapID, NgayXuat, TongGiaTri, GhiChu } = data;
  const r = await q(
    client,
    `INSERT INTO "PhieuXuatKho" ("MaPhieuXuat","NhanVienLapID","NgayXuat","TongGiaTri","GhiChu")
     VALUES ($1,$2,$3,$4,$5) RETURNING ${PX_COLS}`,
    [MaPhieuXuat, NhanVienLapID, NgayXuat, TongGiaTri, GhiChu ?? null]
  );
  return r.rows[0];
}
async function ThemChiTietXuat({ PhieuXuatKhoID, NguyenLieuID, SoLuong, DonGia, GhiChu }, client = null) {
  await q(
    client,
    `INSERT INTO "ChiTietXuatKho" ("PhieuXuatKhoID","NguyenLieuID","SoLuong","DonGia","GhiChu")
     VALUES ($1,$2,$3,$4,$5)`,
    [PhieuXuatKhoID, NguyenLieuID, SoLuong, DonGia, GhiChu ?? null]
  );
}
async function DanhSachXuat({ TuNgay, DenNgay } = {}) {
  const dk = [];
  const params = [];
  if (TuNgay) {
    params.push(TuNgay);
    dk.push(`"NgayXuat" >= $${params.length}`);
  }
  if (DenNgay) {
    params.push(DenNgay);
    dk.push(`"NgayXuat" <= $${params.length}`);
  }
  const where = dk.length ? `WHERE ${dk.join(' AND ')}` : '';
  const r = await query(`SELECT ${PX_COLS} FROM "PhieuXuatKho" ${where} ORDER BY "NgayXuat" DESC, "PhieuXuatKhoID" DESC`, params);
  return r.rows;
}
async function TimPhieuXuat(id) {
  const r = await query(`SELECT ${PX_COLS} FROM "PhieuXuatKho" WHERE "PhieuXuatKhoID" = $1`, [id]);
  return r.rows[0] || null;
}
async function ChiTietXuatCuaPhieu(id) {
  const r = await query(
    `SELECT ct."NguyenLieuID", nl."TenNVL", nl."DonViTinh", ct."SoLuong", ct."DonGia", ct."ThanhTien", ct."GhiChu"
     FROM "ChiTietXuatKho" ct JOIN "NguyenLieu" nl ON nl."NguyenLieuID" = ct."NguyenLieuID"
     WHERE ct."PhieuXuatKhoID" = $1 ORDER BY ct."NguyenLieuID"`,
    [id]
  );
  return r.rows;
}

/* ===================== Tổng hợp cho báo cáo ===================== */

// Tổng nhập theo NVL. dieuKien: { tu, den, sau } trên NgayNhap.
async function TongNhapTheoNVL({ tu, den, sau } = {}) {
  const dk = [];
  const params = [];
  if (tu) { params.push(tu); dk.push(`p."NgayNhap" >= $${params.length}`); }
  if (den) { params.push(den); dk.push(`p."NgayNhap" <= $${params.length}`); }
  if (sau) { params.push(sau); dk.push(`p."NgayNhap" > $${params.length}`); }
  const where = dk.length ? `WHERE ${dk.join(' AND ')}` : '';
  const r = await query(
    `SELECT ct."NguyenLieuID", SUM(ct."SoLuong") AS "TongSoLuong", SUM(ct."ThanhTien") AS "TongGiaTri"
     FROM "ChiTietNhapKho" ct JOIN "PhieuNhapKho" p ON p."PhieuNhapKhoID" = ct."PhieuNhapKhoID"
     ${where} GROUP BY ct."NguyenLieuID"`,
    params
  );
  return r.rows;
}

async function TongXuatTheoNVL({ tu, den, sau } = {}) {
  const dk = [];
  const params = [];
  if (tu) { params.push(tu); dk.push(`p."NgayXuat" >= $${params.length}`); }
  if (den) { params.push(den); dk.push(`p."NgayXuat" <= $${params.length}`); }
  if (sau) { params.push(sau); dk.push(`p."NgayXuat" > $${params.length}`); }
  const where = dk.length ? `WHERE ${dk.join(' AND ')}` : '';
  const r = await query(
    `SELECT ct."NguyenLieuID", SUM(ct."SoLuong") AS "TongSoLuong", SUM(ct."ThanhTien") AS "TongGiaTri"
     FROM "ChiTietXuatKho" ct JOIN "PhieuXuatKho" p ON p."PhieuXuatKhoID" = ct."PhieuXuatKhoID"
     ${where} GROUP BY ct."NguyenLieuID"`,
    params
  );
  return r.rows;
}

// Báo cáo nhập (K_BM4) — gộp theo NVL + NCC trong kỳ.
async function BaoCaoNhap({ TuNgay, DenNgay, NhaCungCapID }) {
  const params = [TuNgay, DenNgay];
  let extra = '';
  if (NhaCungCapID) {
    params.push(NhaCungCapID);
    extra = ` AND p."NhaCungCapID" = $${params.length}`;
  }
  const r = await query(
    `SELECT ct."NguyenLieuID", nl."TenNVL", nl."DonViTinh", ncc."TenNCC",
            SUM(ct."SoLuong") AS "TongSoLuong", SUM(ct."ThanhTien") AS "TongGiaTri"
     FROM "ChiTietNhapKho" ct
       JOIN "PhieuNhapKho" p ON p."PhieuNhapKhoID" = ct."PhieuNhapKhoID"
       JOIN "NguyenLieu" nl ON nl."NguyenLieuID" = ct."NguyenLieuID"
       JOIN "NhaCungCap" ncc ON ncc."NhaCungCapID" = p."NhaCungCapID"
     WHERE p."NgayNhap" >= $1 AND p."NgayNhap" <= $2 ${extra}
     GROUP BY ct."NguyenLieuID", nl."TenNVL", nl."DonViTinh", ncc."TenNCC"
     ORDER BY nl."TenNVL"`,
    params
  );
  return r.rows;
}

// Báo cáo xuất (K_BM5) — gộp theo NVL trong kỳ.
async function BaoCaoXuat({ TuNgay, DenNgay }) {
  const r = await query(
    `SELECT ct."NguyenLieuID", nl."TenNVL", nl."DonViTinh",
            SUM(ct."SoLuong") AS "TongSoLuong", SUM(ct."ThanhTien") AS "TongGiaTri"
     FROM "ChiTietXuatKho" ct
       JOIN "PhieuXuatKho" p ON p."PhieuXuatKhoID" = ct."PhieuXuatKhoID"
       JOIN "NguyenLieu" nl ON nl."NguyenLieuID" = ct."NguyenLieuID"
     WHERE p."NgayXuat" >= $1 AND p."NgayXuat" <= $2
     GROUP BY ct."NguyenLieuID", nl."TenNVL", nl."DonViTinh"
     ORDER BY nl."TenNVL"`,
    [TuNgay, DenNgay]
  );
  return r.rows;
}

async function LayTatCaNVL() {
  const r = await query(`SELECT ${NVL_COLS} FROM "NguyenLieu" WHERE "DangSuDung" = TRUE ORDER BY "NguyenLieuID"`);
  return r.rows;
}

module.exports = {
  // NCC
  DanhSachNCC, TimNCC, TonTaiTenNCC, ThemNCC, CapNhatNCC, XoaMemNCC,
  // NVL
  DanhSachNVL, TimNVL, TonTaiTenNVL, ThemNVL, CapNhatNVL, XoaMemNVL,
  CongTonKho, TruTonKhoCoKiemTra, LayNvlDuoiDinhMuc, LayTatCaNVL,
  // Nhập
  DemPhieuNhapTrongNgay, ThemPhieuNhap, ThemChiTietNhap, DanhSachNhap, TimPhieuNhap, ChiTietNhapCuaPhieu,
  // Xuất
  DemPhieuXuatTrongNgay, ThemPhieuXuat, ThemChiTietXuat, DanhSachXuat, TimPhieuXuat, ChiTietXuatCuaPhieu,
  // Báo cáo
  TongNhapTheoNVL, TongXuatTheoNVL, BaoCaoNhap, BaoCaoXuat,
};
