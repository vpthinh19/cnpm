// Hằng số hệ thống — thay cho bảng CauHinh đã loại bỏ (DESIGN §2.6).
module.exports = {
  // Thông tin nhà hàng (in trên hóa đơn TN_BM3)
  NHA_HANG: {
    ten: 'Bò Né Mỹ Cảnh',
    dia_chi: '... (điền địa chỉ thật)',
    so_dien_thoai: '... (điền SĐT thật)',
    ma_so_thue: '... (nếu có)',
  },

  // Thanh toán
  VAT_TY_LE: 0.10, // 10%

  // Phiên đăng nhập
  PHIEN_DANG_NHAP_PHUT: 30, // JWT hết hạn sau 30 phút
  SO_LAN_SAI_TOI_DA: 5, // Khóa tài khoản sau 5 lần sai

  // Giờ hoạt động (kiểm tra khi đặt bàn / gọi món)
  GIO_MO: '08:00',
  GIO_DONG: '22:00',

  // Báo cáo
  TOP_N_BAO_CAO: 10, // Số món bán chạy trong dashboard

  // Vai trò hợp lệ (Role.RoleID)
  VAI_TRO: ['Admin', 'PhucVu', 'Bep', 'ThuNgan', 'Kho'],
};
