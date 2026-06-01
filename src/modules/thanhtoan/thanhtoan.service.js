// Tầng service M6 — Thanh toán (pseudocode §5.5, DFD §7.2.1, TN_QĐ1).
const repo = require('./thanhtoan.repository');
const orderRepo = require('../order/order.repository');
const banRepo = require('../ban/ban.repository');
const { withTransaction } = require('../../config/db');
const { VAT_TY_LE, NHA_HANG } = require('../../config/constants');
const { ngayYYYYMMDD } = require('../../utils/maNghiepVu');
const ApiError = require('../../utils/ApiError');

const HINH_THUC = ['TienMat', 'ChuyenKhoan'];

// Tính các con số hóa đơn từ dòng order (dùng cho xem-trước + thanh toán).
async function tinhHoaDon(phieuOrderID) {
  const order = await orderRepo.TimOrder(phieuOrderID);
  if (!order) throw ApiError.notFound('Không tìm thấy order');
  if (order.TrangThai !== 'DangPhucVu') throw ApiError.conflictState('Order đã thanh toán / đã hủy');

  const dong = await orderRepo.LayChiTietTheoOrder(phieuOrderID);
  // TN_QĐ1: mọi dòng phải DaPhucVu hoặc DaHuy.
  if (dong.some((d) => !['DaPhucVu', 'DaHuy'].includes(d.TrangThai))) {
    throw ApiError.conflictState('Còn món chưa phục vụ xong');
  }
  const dongTinhTien = dong.filter((d) => d.TrangThai !== 'DaHuy');
  const TongTienMon = dongTinhTien.reduce((s, d) => s + Number(d.ThanhTien), 0);
  const TyLeVat = VAT_TY_LE;
  const TienVat = Math.round(TongTienMon * TyLeVat);
  const TongThanhToan = TongTienMon + TienVat;
  return { order, dongTinhTien, TongTienMon, TyLeVat, TienVat, TongThanhToan };
}

async function XemTruoc(phieuOrderID) {
  const r = await tinhHoaDon(phieuOrderID);
  return {
    PhieuOrderID: r.order.PhieuOrderID,
    BanID: r.order.BanID,
    TongTienMon: r.TongTienMon,
    TyLeVat: r.TyLeVat,
    TienVat: r.TienVat,
    TongThanhToan: r.TongThanhToan,
    ChiTiet: r.dongTinhTien,
  };
}

async function XuLyThanhToan(dl, nhanVienID) {
  const { PhieuOrderID, HinhThucTT, TienKhachDua, MaGiaoDich } = dl;
  if (!HINH_THUC.includes(HinhThucTT)) throw ApiError.validation('Hình thức thanh toán không hợp lệ');

  const r = await tinhHoaDon(PhieuOrderID);
  const { order, dongTinhTien, TongTienMon, TyLeVat, TienVat, TongThanhToan } = r;

  let tienKhachDua = null;
  let tienThua = 0;
  if (HinhThucTT === 'TienMat') {
    tienKhachDua = Number(TienKhachDua);
    if (!Number.isFinite(tienKhachDua) || tienKhachDua < TongThanhToan) {
      throw ApiError.ruleViolation('Tiền khách đưa không đủ');
    }
    tienThua = tienKhachDua - TongThanhToan;
  }

  // Gộp dòng tính tiền theo MonAnID để snapshot vào ChiTietHoaDon.
  const nhom = new Map();
  for (const d of dongTinhTien) {
    const g = nhom.get(d.MonAnID) || { MonAnID: d.MonAnID, TenMon: d.TenMon, DonGia: Number(d.DonGia), SoLuong: 0 };
    g.SoLuong += d.SoLuong;
    nhom.set(d.MonAnID, g);
  }

  const ban = await banRepo.TimTheoID(order.BanID);

  const hoaDonID = await withTransaction(async (client) => {
    const seq = (await repo.DemHoaDonTrongNgay(client)) + 1;
    const MaHoaDon = `HD${ngayYYYYMMDD()}-${String(seq).padStart(5, '0')}`;
    const hd = await repo.ThemHoaDon(
      {
        MaHoaDon, PhieuOrderID, MaBanSnapshot: ban.MaBan, NhanVienThuNganID: nhanVienID,
        TongTienMon, TyLeVat, TienVat, TongThanhToan, HinhThucTT,
        TienKhachDua: tienKhachDua, TienThua: tienThua, MaGiaoDich,
      },
      client
    );
    for (const g of nhom.values()) {
      await repo.ThemChiTietHoaDon({ HoaDonID: hd.HoaDonID, ...g }, client);
    }
    await orderRepo.CapNhatTrangThaiOrder(PhieuOrderID, 'DaThanhToan', client);
    await banRepo.CapNhatTrangThai(order.BanID, 'Trong', client);
    return hd.HoaDonID;
  });

  return LayChiTietHoaDon(hoaDonID);
}

async function LayDanhSachHoaDon(filter) {
  return repo.DanhSachHoaDon(filter);
}

async function LayChiTietHoaDon(hoaDonID) {
  const hd = await repo.TimHoaDonTheoID(hoaDonID);
  if (!hd) throw ApiError.notFound('Không tìm thấy hóa đơn');
  const ChiTiet = await repo.LayChiTietHoaDon(hoaDonID);
  return { HoaDon: hd, ChiTiet, NhaHang: NHA_HANG };
}

async function InHoaDon(hoaDonID) {
  const hd = await repo.TimHoaDonTheoID(hoaDonID);
  if (!hd) throw ApiError.notFound('Không tìm thấy hóa đơn');
  const soLanIn = await repo.TangSoLanIn(hoaDonID);
  const ChiTiet = await repo.LayChiTietHoaDon(hoaDonID);
  hd.SoLanIn = soLanIn;
  return { HoaDon: hd, ChiTiet, NhaHang: NHA_HANG, BanSao: soLanIn >= 2 };
}

async function BaoCaoDoanhThu({ TuNgay, DenNgay }) {
  if (!TuNgay || !DenNgay) throw ApiError.validation('Thiếu TuNgay hoặc DenNgay');
  if (TuNgay > DenNgay) throw ApiError.validation('Khoảng ngày không hợp lệ');
  return repo.BaoCaoDoanhThu({ TuNgay, DenNgay });
}

module.exports = {
  XemTruoc,
  XuLyThanhToan,
  LayDanhSachHoaDon,
  LayChiTietHoaDon,
  InHoaDon,
  BaoCaoDoanhThu,
};
