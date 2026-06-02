// Tầng service M3 — thực đơn (DFD §7.5.1, DESIGN §4.3).
const repo = require('./monan.repository');
const ApiError = require('../../utils/ApiError');

const LOAI_MON = ['MonAn', 'DoUong'];
const TRANG_THAI = ['ConHang', 'HetHang'];

function kiemTraDonGia(DonGia) {
  const n = Number(DonGia);
  if (!Number.isFinite(n) || n < 0) throw ApiError.ruleViolation('Đơn giá phải là số không âm');
  return n;
}

async function LayDanhSach(filter) {
  return repo.DanhSach(filter);
}

async function LayChiTiet(monAnID) {
  const mon = await repo.TimTheoID(monAnID);
  if (!mon || !mon.DangSuDung) throw ApiError.notFound('Không tìm thấy món');
  return mon;
}

async function TaoMon({ MaMonAn, TenMon, LoaiMon, DonGia, MoTa }) {
  if (!MaMonAn || !TenMon) throw ApiError.validation('Thiếu mã sản phẩm hoặc tên món');
  if (!LOAI_MON.includes(LoaiMon)) throw ApiError.validation('Loại món không hợp lệ');
  const donGia = kiemTraDonGia(DonGia);
  if (await repo.TonTaiCot('MaMonAn', MaMonAn)) throw ApiError.duplicate('Mã sản phẩm đã tồn tại');
  if (await repo.TonTaiCot('TenMon', TenMon)) throw ApiError.duplicate('Tên món đã tồn tại');
  return repo.Them({ MaMonAn, TenMon, LoaiMon, DonGia: donGia, MoTa });
}

async function CapNhatMon(monAnID, { TenMon, LoaiMon, DonGia, MoTa }) {
  await LayChiTiet(monAnID);
  if (!TenMon) throw ApiError.validation('Thiếu tên món');
  if (!LOAI_MON.includes(LoaiMon)) throw ApiError.validation('Loại món không hợp lệ');
  const donGia = kiemTraDonGia(DonGia);
  // MaMonAn (mã sổ sách) không sửa — chỉ kiểm tra trùng TenMon.
  if (await repo.TonTaiCot('TenMon', TenMon, monAnID)) throw ApiError.duplicate('Tên món đã tồn tại');
  return repo.CapNhat(monAnID, { TenMon, LoaiMon, DonGia: donGia, MoTa });
}

async function DoiTrangThai(monAnID, TrangThai) {
  await LayChiTiet(monAnID);
  if (!TRANG_THAI.includes(TrangThai)) throw ApiError.validation('Trạng thái không hợp lệ');
  return repo.DoiTrangThai(monAnID, TrangThai);
}

async function XoaMon(monAnID) {
  await LayChiTiet(monAnID);
  await repo.XoaMem(monAnID);
}

module.exports = { LayDanhSach, LayChiTiet, TaoMon, CapNhatMon, DoiTrangThai, XoaMon };
