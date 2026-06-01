// Tầng service M5 — Order + Bếp (pseudocode §5.4; DFD §7.1.2/3/4, §7.3.1/2; B_QĐ1).
const repo = require('./order.repository');
const banRepo = require('../ban/ban.repository');
const monRepo = require('../monan/monan.repository');
const { withTransaction } = require('../../config/db');
const ApiError = require('../../utils/ApiError');

/* ---------- Helper ---------- */

// Kiểm tra danh sách món + trả về list đã làm giàu (snapshot DonGia, LoaiMon).
async function chuanBiDanhSachMon(danhSachMon) {
  if (!Array.isArray(danhSachMon) || danhSachMon.length === 0) {
    throw ApiError.validation('Danh sách món trống');
  }
  const ketQua = [];
  for (const m of danhSachMon) {
    const soLuong = Number(m.SoLuong);
    if (!Number.isInteger(soLuong) || soLuong <= 0) {
      throw ApiError.ruleViolation('Số lượng món phải là số nguyên dương');
    }
    const mon = await monRepo.TimTheoID(m.MonAnID);
    if (!mon || !mon.DangSuDung) throw ApiError.notFound(`Không tìm thấy món (MonAnID=${m.MonAnID})`);
    if (mon.TrangThai !== 'ConHang') throw ApiError.ruleViolation(`Món "${mon.TenMon}" đã hết hàng`);
    ketQua.push({ MonAnID: mon.MonAnID, SoLuong: soLuong, DonGia: mon.DonGia, GhiChu: m.GhiChu, LoaiMon: mon.LoaiMon });
  }
  return ketQua;
}

// Order kèm danh sách dòng món (dùng cho phần lớn response).
async function layOrderDayDu(phieuOrderID) {
  const order = await repo.TimOrder(phieuOrderID);
  if (!order) throw ApiError.notFound('Không tìm thấy order');
  order.ChiTiet = await repo.LayChiTietTheoOrder(phieuOrderID);
  return order;
}

/* ---------- Tra cứu ---------- */

async function LayDanhSach(filter) {
  return repo.DanhSachOrder(filter);
}

async function LayChiTietOrder(phieuOrderID) {
  return layOrderDayDu(phieuOrderID);
}

async function LayOrderDangPhucVuTheoBan(banID) {
  const order = await repo.LayOrderDangPhucVuTheoBan(banID);
  if (!order) throw ApiError.notFound('Bàn chưa có order đang phục vụ');
  order.ChiTiet = await repo.LayChiTietTheoOrder(order.PhieuOrderID);
  return order;
}

/* ---------- Gọi món (§7.1.2) ---------- */

async function MoOrder(banID, danhSachMon, nhanVienID) {
  const ban = await banRepo.TimTheoID(banID);
  if (!ban || !ban.DangSuDung) throw ApiError.notFound('Không tìm thấy bàn');
  if (!['Trong', 'CoKhach'].includes(ban.TrangThai)) {
    throw ApiError.conflictState('Bàn đang giữ chỗ — vui lòng nhận bàn trước');
  }
  if (await repo.CoOrderDangPhucVu(banID)) {
    throw ApiError.conflictState('Bàn đã có order — dùng Thêm món');
  }
  const ds = await chuanBiDanhSachMon(danhSachMon);

  const orderID = await withTransaction(async (client) => {
    const order = await repo.ThemOrder({ BanID: banID, NhanVienPhucVuID: nhanVienID }, client);
    let soDong = 0;
    for (const m of ds) {
      soDong += 1;
      await repo.ThemDong(
        { PhieuOrderID: order.PhieuOrderID, SoDong: soDong, MonAnID: m.MonAnID, SoLuong: m.SoLuong, DonGia: m.DonGia, GhiChu: m.GhiChu },
        client
      );
    }
    if (ban.TrangThai === 'Trong') await banRepo.CapNhatTrangThai(banID, 'CoKhach', client); // walk-in
    await repo.CapNhatTongTamTinh(order.PhieuOrderID, client);
    return order.PhieuOrderID;
  });

  return layOrderDayDu(orderID);
}

async function ThemDongMon(phieuOrderID, danhSachMon) {
  const order = await repo.TimOrder(phieuOrderID);
  if (!order) throw ApiError.notFound('Không tìm thấy order');
  if (order.TrangThai !== 'DangPhucVu') throw ApiError.conflictState('Order không ở trạng thái đang phục vụ');
  const ds = await chuanBiDanhSachMon(danhSachMon);

  await withTransaction(async (client) => {
    let soDong = await repo.MaxSoDong(phieuOrderID, client);
    for (const m of ds) {
      soDong += 1;
      await repo.ThemDong(
        { PhieuOrderID: phieuOrderID, SoDong: soDong, MonAnID: m.MonAnID, SoLuong: m.SoLuong, DonGia: m.DonGia, GhiChu: m.GhiChu },
        client
      );
    }
    await repo.CapNhatTongTamTinh(phieuOrderID, client);
  });

  return layOrderDayDu(phieuOrderID);
}

async function SuaDongMon(phieuOrderID, soDong, { SoLuong, GhiChu }) {
  const dong = await repo.LayMotDong(phieuOrderID, soDong);
  if (!dong) throw ApiError.notFound('Không tìm thấy dòng món');
  if (dong.TrangThai !== 'ChuaChot') throw ApiError.conflictState('Chỉ sửa được dòng chưa chốt');
  const soLuong = Number(SoLuong);
  if (!Number.isInteger(soLuong) || soLuong <= 0) throw ApiError.ruleViolation('Số lượng phải là số nguyên dương');

  await withTransaction(async (client) => {
    await repo.SuaDong(phieuOrderID, soDong, { SoLuong: soLuong, GhiChu }, client);
    await repo.CapNhatTongTamTinh(phieuOrderID, client);
  });
  return layOrderDayDu(phieuOrderID);
}

async function XoaDongMon(phieuOrderID, soDong) {
  const dong = await repo.LayMotDong(phieuOrderID, soDong);
  if (!dong) throw ApiError.notFound('Không tìm thấy dòng món');
  if (dong.TrangThai !== 'ChuaChot') throw ApiError.conflictState('Chỉ xóa được dòng chưa chốt');

  await withTransaction(async (client) => {
    await repo.XoaDong(phieuOrderID, soDong, client);
    await repo.CapNhatTongTamTinh(phieuOrderID, client);
  });
  return layOrderDayDu(phieuOrderID);
}

/* ---------- Chốt bếp (§7.1.3) ---------- */

async function ChotOrder(phieuOrderID, nhanVienID) {
  const order = await repo.TimOrder(phieuOrderID);
  if (!order) throw ApiError.notFound('Không tìm thấy order');
  if (order.TrangThai !== 'DangPhucVu') throw ApiError.conflictState('Order không ở trạng thái đang phục vụ');
  const dsChuaChot = await repo.LayChiTietTheoOrder(phieuOrderID, { TrangThai: 'ChuaChot' });
  if (dsChuaChot.length === 0) throw ApiError.conflictState('Không có món để chốt');

  let soBep = 0;
  let soDoUong = 0;
  await withTransaction(async (client) => {
    for (const d of dsChuaChot) {
      if (d.LoaiMon === 'MonAn') {
        await repo.ChotMonAn(phieuOrderID, d.SoDong, client);
        soBep += 1;
      } else {
        await repo.ChotDoUong(phieuOrderID, d.SoDong, nhanVienID, client);
        soDoUong += 1;
      }
    }
  });
  return { SoMonVaoBep: soBep, SoDoUongDaPhucVu: soDoUong };
}

// Phiếu chuyển bếp (PV_BM3) — tra cứu thuần, chỉ món ăn ChoCheBien.
async function LayPhieuBep(phieuOrderID) {
  const order = await repo.TimOrder(phieuOrderID);
  if (!order) throw ApiError.notFound('Không tìm thấy order');
  const dong = (await repo.LayChiTietTheoOrder(phieuOrderID, { TrangThai: 'ChoCheBien' })).filter(
    (d) => d.LoaiMon === 'MonAn'
  );
  return { PhieuOrderID: order.PhieuOrderID, BanID: order.BanID, ChiTiet: dong };
}

/* ---------- Bếp (§7.3.1, §7.3.2) ---------- */

async function HangChoBep() {
  return repo.HangChoBep();
}

// B_QĐ1: chuyển tuần tự ChoCheBien→DangCheBien→DaXong, không bỏ bước.
async function CapNhatTrangThaiMon(phieuOrderID, soDong, trangThaiMoi) {
  const d = await repo.LayMotDong(phieuOrderID, soDong);
  if (!d) throw ApiError.notFound('Không tìm thấy dòng món');
  const hopLe =
    (d.TrangThai === 'ChoCheBien' && trangThaiMoi === 'DangCheBien') ||
    (d.TrangThai === 'DangCheBien' && trangThaiMoi === 'DaXong');
  if (!hopLe) throw ApiError.conflictState('Sai thứ tự trạng thái món');

  if (trangThaiMoi === 'DangCheBien') await repo.DanhDauDangCheBien(phieuOrderID, soDong);
  else await repo.DanhDauXong(phieuOrderID, soDong);
  return repo.LayMotDong(phieuOrderID, soDong);
}

/* ---------- Phục vụ ra bàn & hủy (§7.1.4) ---------- */

async function MonSanSangPhucVu() {
  return repo.MonSanSangPhucVu();
}

async function PhucVuMon(phieuOrderID, soDong, nhanVienID) {
  const d = await repo.LayMotDong(phieuOrderID, soDong);
  if (!d) throw ApiError.notFound('Không tìm thấy dòng món');
  if (d.TrangThai !== 'DaXong') throw ApiError.conflictState('Món chưa xong / đã phục vụ');
  await repo.DanhDauPhucVu(phieuOrderID, soDong, nhanVienID);
  return repo.LayMotDong(phieuOrderID, soDong);
}

async function HuyDongMon(phieuOrderID, soDong) {
  const d = await repo.LayMotDong(phieuOrderID, soDong);
  if (!d) throw ApiError.notFound('Không tìm thấy dòng món');
  if (d.TrangThai === 'DaPhucVu') throw ApiError.conflictState('Món đã phục vụ, không thể hủy');
  await withTransaction(async (client) => {
    await repo.DanhDauHuyDong(phieuOrderID, soDong, client);
    await repo.CapNhatTongTamTinh(phieuOrderID, client);
  });
  return layOrderDayDu(phieuOrderID);
}

async function HuyOrder(phieuOrderID) {
  const order = await repo.TimOrder(phieuOrderID);
  if (!order) throw ApiError.notFound('Không tìm thấy order');
  if (order.TrangThai !== 'DangPhucVu') throw ApiError.conflictState('Order đã thanh toán / đã hủy');
  const dong = await repo.LayChiTietTheoOrder(phieuOrderID);
  if (dong.some((d) => d.TrangThai !== 'ChuaChot')) {
    throw ApiError.conflictState('Đã có món gửi bếp — hủy từng món thay vì cả order');
  }
  await withTransaction(async (client) => {
    await repo.CapNhatTrangThaiOrder(phieuOrderID, 'DaHuy', client);
    for (const d of dong) await repo.DanhDauHuyDong(phieuOrderID, d.SoDong, client);
    await banRepo.CapNhatTrangThai(order.BanID, 'Trong', client); // trả bàn về Trống
  });
  return repo.TimOrder(phieuOrderID);
}

module.exports = {
  LayDanhSach,
  LayChiTietOrder,
  LayOrderDangPhucVuTheoBan,
  MoOrder,
  ThemDongMon,
  SuaDongMon,
  XoaDongMon,
  ChotOrder,
  LayPhieuBep,
  HangChoBep,
  CapNhatTrangThaiMon,
  MonSanSangPhucVu,
  PhucVuMon,
  HuyDongMon,
  HuyOrder,
};
