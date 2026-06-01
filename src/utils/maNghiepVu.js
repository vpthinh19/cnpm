// Tiện ích định dạng ngày yyyymmdd cho sinh mã nghiệp vụ (MaHoaDon, MaPhieuNhap, MaPhieuXuat).
function ngayYYYYMMDD(input) {
  const d = input ? new Date(input) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

module.exports = { ngayYYYYMMDD };
