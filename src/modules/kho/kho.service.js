// Tầng service M7 — Kho (pseudocode §5.6, DFD §7.4.x, K_QĐ1).
const repo = require('./kho.repository');
const { withTransaction } = require('../../config/db');
const { ngayYYYYMMDD } = require('../../utils/maNghiepVu');
const ApiError = require('../../utils/ApiError');

/* ===================== Nhà cung cấp ===================== */
async function LayDanhSachNCC() {
  return repo.DanhSachNCC();
}
async function TaoNCC({ TenNCC, SoDienThoai, DiaChi }) {
  if (!TenNCC) throw ApiError.validation('Thiếu tên nhà cung cấp');
  if (await repo.TonTaiTenNCC(TenNCC)) throw ApiError.duplicate('Tên nhà cung cấp đã tồn tại');
  return repo.ThemNCC({ TenNCC, SoDienThoai, DiaChi });
}
async function CapNhatNCC(id, { TenNCC, SoDienThoai, DiaChi }) {
  const ncc = await repo.TimNCC(id);
  if (!ncc || !ncc.DangSuDung) throw ApiError.notFound('Không tìm thấy nhà cung cấp');
  if (!TenNCC) throw ApiError.validation('Thiếu tên nhà cung cấp');
  if (await repo.TonTaiTenNCC(TenNCC, id)) throw ApiError.duplicate('Tên nhà cung cấp đã tồn tại');
  return repo.CapNhatNCC(id, { TenNCC, SoDienThoai, DiaChi });
}
async function XoaNCC(id) {
  const ncc = await repo.TimNCC(id);
  if (!ncc || !ncc.DangSuDung) throw ApiError.notFound('Không tìm thấy nhà cung cấp');
  await repo.XoaMemNCC(id);
}

/* ===================== Nguyên liệu ===================== */
async function LayDanhSachNVL(filter) {
  return repo.DanhSachNVL(filter);
}
async function TaoNVL({ TenNVL, DonViTinh, DinhMucToiThieu }) {
  if (!TenNVL || !DonViTinh) throw ApiError.validation('Thiếu tên hoặc đơn vị tính');
  if (Number(DinhMucToiThieu ?? 0) < 0) throw ApiError.ruleViolation('Định mức tối thiểu không âm');
  if (await repo.TonTaiTenNVL(TenNVL)) throw ApiError.duplicate('Tên nguyên liệu đã tồn tại');
  return repo.ThemNVL({ TenNVL, DonViTinh, DinhMucToiThieu });
}
async function CapNhatNVL(id, { TenNVL, DonViTinh, DinhMucToiThieu }) {
  const nvl = await repo.TimNVL(id);
  if (!nvl || !nvl.DangSuDung) throw ApiError.notFound('Không tìm thấy nguyên liệu');
  if (!TenNVL || !DonViTinh) throw ApiError.validation('Thiếu tên hoặc đơn vị tính');
  if (Number(DinhMucToiThieu ?? 0) < 0) throw ApiError.ruleViolation('Định mức tối thiểu không âm');
  if (await repo.TonTaiTenNVL(TenNVL, id)) throw ApiError.duplicate('Tên nguyên liệu đã tồn tại');
  return repo.CapNhatNVL(id, { TenNVL, DonViTinh, DinhMucToiThieu });
}
async function XoaNVL(id) {
  const nvl = await repo.TimNVL(id);
  if (!nvl || !nvl.DangSuDung) throw ApiError.notFound('Không tìm thấy nguyên liệu');
  await repo.XoaMemNVL(id);
}

/* ===================== Phiếu nhập / xuất ===================== */

// Kiểm tra + làm giàu chi tiết phiếu (K_QĐ1): NVL tồn tại, SoLuong>0, DonGia>0.
async function chuanBiChiTiet(ChiTiet) {
  if (!Array.isArray(ChiTiet) || ChiTiet.length === 0) throw ApiError.validation('Danh sách chi tiết trống');
  const ds = [];
  for (const c of ChiTiet) {
    const soLuong = Number(c.SoLuong);
    const donGia = Number(c.DonGia);
    if (!(soLuong > 0) || !(donGia > 0)) throw ApiError.ruleViolation('Số lượng và đơn giá phải > 0');
    const nvl = await repo.TimNVL(c.NguyenLieuID);
    if (!nvl || !nvl.DangSuDung) throw ApiError.notFound(`Nguyên liệu không tồn tại (NguyenLieuID=${c.NguyenLieuID})`);
    ds.push({ NguyenLieuID: nvl.NguyenLieuID, SoLuong: soLuong, DonGia: donGia, GhiChu: c.GhiChu });
  }
  return ds;
}

async function LapPhieuNhapKho({ NhaCungCapID, NgayNhap, GhiChu, ChiTiet }, nhanVienID) {
  if (!NgayNhap) throw ApiError.validation('Thiếu ngày nhập');
  const ncc = await repo.TimNCC(NhaCungCapID);
  if (!ncc || !ncc.DangSuDung) throw ApiError.notFound('Nhà cung cấp không tồn tại');
  const ds = await chuanBiChiTiet(ChiTiet);
  const tongGiaTri = ds.reduce((s, c) => s + c.SoLuong * c.DonGia, 0);

  const phieuID = await withTransaction(async (client) => {
    const seq = (await repo.DemPhieuNhapTrongNgay(NgayNhap, client)) + 1;
    const MaPhieuNhap = `PN${ngayYYYYMMDD(NgayNhap)}-${String(seq).padStart(3, '0')}`;
    const phieu = await repo.ThemPhieuNhap(
      { MaPhieuNhap, NhaCungCapID, NhanVienLapID: nhanVienID, NgayNhap, TongGiaTri: tongGiaTri, GhiChu },
      client
    );
    for (const c of ds) {
      await repo.ThemChiTietNhap({ PhieuNhapKhoID: phieu.PhieuNhapKhoID, ...c }, client);
      await repo.CongTonKho(c.NguyenLieuID, c.SoLuong, client); // §2.4 #6
    }
    return phieu.PhieuNhapKhoID;
  });
  return LayChiTietPhieuNhap(phieuID);
}

async function LapPhieuXuatKho({ NgayXuat, GhiChu, ChiTiet }, nhanVienID) {
  if (!NgayXuat) throw ApiError.validation('Thiếu ngày xuất');
  const ds = await chuanBiChiTiet(ChiTiet);
  const tongGiaTri = ds.reduce((s, c) => s + c.SoLuong * c.DonGia, 0);

  const phieuID = await withTransaction(async (client) => {
    const seq = (await repo.DemPhieuXuatTrongNgay(NgayXuat, client)) + 1;
    const MaPhieuXuat = `PX${ngayYYYYMMDD(NgayXuat)}-${String(seq).padStart(3, '0')}`;
    const phieu = await repo.ThemPhieuXuat(
      { MaPhieuXuat, NhanVienLapID: nhanVienID, NgayXuat, TongGiaTri: tongGiaTri, GhiChu },
      client
    );
    for (const c of ds) {
      await repo.ThemChiTietXuat({ PhieuXuatKhoID: phieu.PhieuXuatKhoID, ...c }, client);
      // §2.4 #3: trừ tồn có kiểm tra, ROWCOUNT=0 → xuất quá tồn → rollback.
      const rc = await repo.TruTonKhoCoKiemTra(c.NguyenLieuID, c.SoLuong, client);
      if (rc === 0) throw ApiError.conflictState(`Xuất quá tồn kho (NguyenLieuID=${c.NguyenLieuID})`);
    }
    return phieu.PhieuXuatKhoID;
  });

  const phieu = await LayChiTietPhieuXuat(phieuID);
  const CanhBao = await repo.LayNvlDuoiDinhMuc(ds.map((c) => c.NguyenLieuID));
  return { ...phieu, CanhBao };
}

async function LayDanhSachNhap(filter) {
  return repo.DanhSachNhap(filter);
}
async function LayChiTietPhieuNhap(id) {
  const phieu = await repo.TimPhieuNhap(id);
  if (!phieu) throw ApiError.notFound('Không tìm thấy phiếu nhập');
  const ncc = await repo.TimNCC(phieu.NhaCungCapID);
  phieu.TenNCC = ncc ? ncc.TenNCC : null;
  phieu.ChiTiet = await repo.ChiTietNhapCuaPhieu(id);
  return phieu;
}
async function LayDanhSachXuat(filter) {
  return repo.DanhSachXuat(filter);
}
async function LayChiTietPhieuXuat(id) {
  const phieu = await repo.TimPhieuXuat(id);
  if (!phieu) throw ApiError.notFound('Không tìm thấy phiếu xuất');
  phieu.ChiTiet = await repo.ChiTietXuatCuaPhieu(id);
  return phieu;
}

/* ===================== Báo cáo ===================== */

function kiemTraKy(TuNgay, DenNgay) {
  if (!TuNgay || !DenNgay) throw ApiError.validation('Thiếu TuNgay hoặc DenNgay');
  if (TuNgay > DenNgay) throw ApiError.validation('Khoảng ngày không hợp lệ');
}

async function BaoCaoTon({ TuNgay, DenNgay }) {
  kiemTraKy(TuNgay, DenNgay);
  const nvls = await repo.LayTatCaNVL();
  const toMap = (rows) => {
    const m = new Map();
    rows.forEach((r) => m.set(r.NguyenLieuID, Number(r.TongSoLuong)));
    return m;
  };
  const nhapKy = toMap(await repo.TongNhapTheoNVL({ tu: TuNgay, den: DenNgay }));
  const xuatKy = toMap(await repo.TongXuatTheoNVL({ tu: TuNgay, den: DenNgay }));
  const nhapSau = toMap(await repo.TongNhapTheoNVL({ sau: DenNgay }));
  const xuatSau = toMap(await repo.TongXuatTheoNVL({ sau: DenNgay }));

  return nvls.map((nvl) => {
    const id = nvl.NguyenLieuID;
    const nk = nhapKy.get(id) || 0;
    const xk = xuatKy.get(id) || 0;
    const ns = nhapSau.get(id) || 0;
    const xs = xuatSau.get(id) || 0;
    const TonCuoi = Number(nvl.TonHienTai) - ns + xs;
    const TonDau = TonCuoi - nk + xk;
    return { NguyenLieuID: id, TenNVL: nvl.TenNVL, DonViTinh: nvl.DonViTinh, TonDau, Nhap: nk, Xuat: xk, TonCuoi };
  });
}

async function BaoCaoNhap({ TuNgay, DenNgay, NhaCungCapID }) {
  kiemTraKy(TuNgay, DenNgay);
  const DanhSach = await repo.BaoCaoNhap({ TuNgay, DenNgay, NhaCungCapID });
  const TongGiaTri = DanhSach.reduce((s, r) => s + Number(r.TongGiaTri), 0);
  return { DanhSach, TongGiaTri };
}

async function BaoCaoXuat({ TuNgay, DenNgay }) {
  kiemTraKy(TuNgay, DenNgay);
  const DanhSach = await repo.BaoCaoXuat({ TuNgay, DenNgay });
  const TongGiaTri = DanhSach.reduce((s, r) => s + Number(r.TongGiaTri), 0);
  return { DanhSach, TongGiaTri };
}

module.exports = {
  LayDanhSachNCC, TaoNCC, CapNhatNCC, XoaNCC,
  LayDanhSachNVL, TaoNVL, CapNhatNVL, XoaNVL,
  LapPhieuNhapKho, LapPhieuXuatKho,
  LayDanhSachNhap, LayChiTietPhieuNhap, LayDanhSachXuat, LayChiTietPhieuXuat,
  BaoCaoTon, BaoCaoNhap, BaoCaoXuat,
};
