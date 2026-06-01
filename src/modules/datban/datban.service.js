// Tầng service M4 — Đặt bàn (pseudocode §5.3, DFD §7.1.1, PV_QĐ1).
const repo = require('./datban.repository');
const banRepo = require('../ban/ban.repository');
const { withTransaction } = require('../../config/db');
const { trongGioHoatDong } = require('../../utils/gioHoatDong');
const ApiError = require('../../utils/ApiError');

const HINH_THUC = ['TrucTiep', 'QuaDienThoai'];

async function LayDanhSach(filter) {
  return repo.DanhSach(filter);
}

async function LayChiTiet(phieuDatBanID) {
  const phieu = await repo.TimTheoID(phieuDatBanID);
  if (!phieu) throw ApiError.notFound('Không tìm thấy phiếu đặt bàn');
  return phieu;
}

async function XuLyDatBan(dl, nhanVienID) {
  const { BanID, TenKhach, SoDienThoai, SoNguoi, ThoiGianDat, HinhThucDat, GhiChu } = dl;
  if (!BanID || !TenKhach || !SoDienThoai || !ThoiGianDat) {
    throw ApiError.validation('Thiếu thông tin: BanID, TenKhach, SoDienThoai, ThoiGianDat');
  }
  if (!HINH_THUC.includes(HinhThucDat)) throw ApiError.validation('Hình thức đặt không hợp lệ');

  const ban = await banRepo.TimTheoID(BanID);
  if (!ban || !ban.DangSuDung) throw ApiError.notFound('Không tìm thấy bàn');
  if (ban.TrangThai !== 'Trong') throw ApiError.conflictState('Bàn không ở trạng thái Trống'); // PV_QĐ1

  const soNguoi = Number(SoNguoi);
  if (!Number.isInteger(soNguoi) || soNguoi <= 0 || soNguoi > ban.SucChua) {
    throw ApiError.ruleViolation('Số người vượt sức chứa');
  }
  if (!trongGioHoatDong(ThoiGianDat)) {
    throw ApiError.ruleViolation('Thời gian đặt ngoài giờ hoạt động');
  }

  return withTransaction(async (client) => {
    const phieu = await repo.Them(
      { BanID, TenKhach, SoDienThoai, SoNguoi: soNguoi, ThoiGianDat, HinhThucDat, GhiChu, NhanVienTiepNhanID: nhanVienID },
      client
    );
    await banRepo.CapNhatTrangThai(BanID, 'DaDat', client); // §2.4 #8
    return phieu;
  });
}

async function NhanBan(phieuDatBanID) {
  const phieu = await LayChiTiet(phieuDatBanID);
  if (phieu.TrangThai !== 'DaDat') throw ApiError.conflictState('Chỉ nhận bàn cho phiếu Đã đặt');
  return withTransaction(async (client) => {
    const updated = await repo.DanhDauNhanBan(phieuDatBanID, client);
    await banRepo.CapNhatTrangThai(phieu.BanID, 'CoKhach', client);
    return updated;
  });
}

async function HuyDatBan(phieuDatBanID) {
  const phieu = await LayChiTiet(phieuDatBanID);
  if (phieu.TrangThai !== 'DaDat') throw ApiError.conflictState('Chỉ hủy phiếu Đã đặt');
  return withTransaction(async (client) => {
    const updated = await repo.DanhDauHuy(phieuDatBanID, client);
    await banRepo.CapNhatTrangThai(phieu.BanID, 'Trong', client);
    return updated;
  });
}

module.exports = { LayDanhSach, LayChiTiet, XuLyDatBan, NhanBan, HuyDatBan };
