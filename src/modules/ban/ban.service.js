// Tầng service M2 — quản lý bàn (DFD §7.5.2, DESIGN §4.2).
// CRUD đơn giản: validate → repo. Không đổi TrangThai ở đây (do M4/M5/M6 đổi).
const repo = require('./ban.repository');
const ApiError = require('../../utils/ApiError');

function kiemTraSucChua(SucChua) {
  const n = Number(SucChua);
  if (!Number.isInteger(n) || n <= 0) {
    throw ApiError.ruleViolation('Sức chứa phải là số nguyên dương');
  }
  return n;
}

async function LayDanhSach(filter) {
  return repo.DanhSach(filter);
}

async function LayChiTiet(banID) {
  const ban = await repo.TimTheoID(banID);
  if (!ban || !ban.DangSuDung) throw ApiError.notFound('Không tìm thấy bàn');
  return ban;
}

async function TaoBan({ MaBan, KhuVuc, SucChua, GhiChu }) {
  if (!MaBan || !KhuVuc) throw ApiError.validation('Thiếu mã bàn hoặc khu vực');
  const sucChua = kiemTraSucChua(SucChua);
  if (await repo.TonTaiMaBan(MaBan)) throw ApiError.duplicate('Mã bàn đã tồn tại');
  return repo.Them({ MaBan, KhuVuc, SucChua: sucChua, GhiChu });
}

async function CapNhatBan(banID, { MaBan, KhuVuc, SucChua, GhiChu }) {
  await LayChiTiet(banID); // đảm bảo tồn tại
  if (!MaBan || !KhuVuc) throw ApiError.validation('Thiếu mã bàn hoặc khu vực');
  const sucChua = kiemTraSucChua(SucChua);
  if (await repo.TonTaiMaBan(MaBan, banID)) throw ApiError.duplicate('Mã bàn đã tồn tại');
  return repo.CapNhat(banID, { MaBan, KhuVuc, SucChua: sucChua, GhiChu });
}

async function XoaBan(banID) {
  const ban = await LayChiTiet(banID);
  // §7.5.2 Bước 4: chỉ xóa khi bàn Trống.
  if (ban.TrangThai !== 'Trong') {
    throw ApiError.conflictState('Chỉ xóa được bàn đang ở trạng thái Trống');
  }
  await repo.XoaMem(banID);
}

module.exports = { LayDanhSach, LayChiTiet, TaoBan, CapNhatBan, XoaBan };
