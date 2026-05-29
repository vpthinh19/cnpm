**HỆ THỐNG QUẢN LÝ NHÀ HÀNG**
**ĐẶC TẢ THIẾT KẾ CHI TIẾT**

> Tài liệu này là "blueprint" cho quy trình triển khai. Mọi quyết định nghiệp vụ tham chiếu về `DESCRIPTION.md` (đặc tả sơ khai). Mọi tên gọi (bảng, cột, endpoint, hàm xử lý) viết bằng **tiếng Việt không dấu**.

# 1. TỔNG QUAN KIẾN TRÚC {#tổng-quan-kiến-trúc}

## 1.1. Sơ đồ kiến trúc

```
┌──────────────────────────────────────────────────────────────────────┐
│  CLIENT — Trình duyệt (Chrome/Edge) trên máy bàn của từng vai trò    │
│  ─ Admin, Phục vụ, Bếp, Thu ngân, Kho                                │
│  ─ HTML5 + CSS3 + JavaScript thuần (vanilla)                         │
│  ─ Máy in nhiệt 80mm gắn vào máy Bếp (in PV_BM3, B_BM1)              │
│  ─ Máy in nhiệt 80mm + A4 gắn vào máy Thu ngân (in TN_BM3)           │
└──────────────────────────────────────────────────────────────────────┘
                              │  HTTPS — REST/JSON
                              │  Authorization: Bearer <JWT>
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  BACKEND — Node.js + Express                                         │
│  ─ Tầng route (Express Router) ──────────────► §4 API                │
│  ─ Tầng controller — validate + middleware JWT/role                  │
│  ─ Tầng service — logic nghiệp vụ ──────────► §5 Pseudocode          │
│  ─ Tầng repository — truy vấn SQL (driver mssql)                     │
│  ─ Hằng số hệ thống: tệp config/constants.js (VAT, giờ HĐ, ...)      │
└──────────────────────────────────────────────────────────────────────┘
                              │  TCP/IP (mssql driver)
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  CSDL — Microsoft SQL Server 2019+                                   │
│  ─ 13 bảng (§2)                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Mô hình triển khai:** chạy trên 1 máy chủ trong mạng LAN của nhà hàng. Toàn bộ client là PC/laptop trong cùng mạng LAN. Sao lưu CSDL nằm ngoài phạm vi ứng dụng (việc của DBA, dùng tính năng backup của SQL Server).

## 1.2. Quy ước đặt tên

| Hạng mục | Quy ước | Ví dụ |
|---|---|---|
| Bảng CSDL | PascalCase tiếng Việt không dấu | `Ban`, `PhieuDatBan`, `ChiTietOrder` |
| Cột CSDL | snake_case tiếng Việt không dấu | `ten_khach`, `tong_thanh_toan` |
| Khóa chính | `ma_<viết_tắt_thực_thể>` | `ma_ban`, `ma_dat_ban`, `ma_order` |
| Khóa ngoại | Cùng tên với khóa chính được tham chiếu | `ma_ban` ở `PhieuDatBan` trỏ về `Ban.ma_ban` |
| Trường thời gian | `thoi_gian_<sự_kiện>` | `thoi_gian_tao`, `thoi_gian_xong` |
| Trường boolean | `dang_<trạng_thái>` | `dang_su_dung` |
| Trường enum/trạng thái | `NVARCHAR(20)` + CHECK constraint, giá trị PascalCase TV không dấu | `'Trong'`, `'DaDat'`, `'CoKhach'` |
| API endpoint | kebab-case TV không dấu, dưới prefix `/api/v1` | `/api/v1/dat-ban`, `/api/v1/thanh-toan` |
| Trường JSON request/response | snake_case TV không dấu, đồng nhất cột DB | `{"ten_khach": "Nguyen Van A"}` |
| Hàm xử lý (pseudocode) | PascalCase TV không dấu | `XuLyDatBan(...)`, `XuLyThanhToan(...)` |
| Biến cục bộ (pseudocode) | camelCase TV không dấu | `danhSachBanTrong`, `tongTienMon` |

**Ngoại lệ — thực thể hệ thống dùng tiếng Anh:** Hai thực thể thuần hệ thống (không phải nghiệp vụ nhà hàng) là **`User`** (tài khoản) và **`Role`** (phân quyền) dùng **tiếng Anh** cho bảng, cột, endpoint và trường JSON, vì rõ nghĩa hơn (vd `/auth/login`, `/users`, `user_id`, `password_hash`). Mọi thực thể nghiệp vụ còn lại giữ tiếng Việt như bảng trên.

- **Giá trị enum** của `User`/`Role` vẫn giữ tiếng Việt để đồng nhất dữ liệu (vai trò `Admin`/`PhucVu`/`Bep`/`ThuNgan`/`Kho`; trạng thái `HoatDong`/`DaKhoa`).
- **Ngoại lệ FK giáp ranh:** 6 cột khóa ngoại nằm trong bảng nghiệp vụ (TV) nhưng trỏ tới `User.user_id` giữ tên tiếng Việt (`nv_tiep_nhan`, `nv_phuc_vu`, `nv_phuc_vu_xac_nhan`, `nv_thu_ngan`, `nv_lap`) — chúng là trường của bảng nghiệp vụ. Đây là ngoại lệ có chủ đích của quy tắc "khóa ngoại cùng tên với khóa chính".

## 1.3. Quy ước trạng thái và mã liệt kê

| Đối tượng | Mã trạng thái | Ý nghĩa |
|---|---|---|
| **Bàn** (`Ban.trang_thai`) | `Trong` / `DaDat` / `CoKhach` | Trống / Có phiếu đặt chưa nhận / Đang phục vụ |
| **Phiếu đặt bàn** (`PhieuDatBan.trang_thai`) | `DaDat` / `DaNhanBan` / `DaHuy` | Đã ghi nhận / Khách đến / Hủy |
| **Dòng món** (`ChiTietOrder.trang_thai`) | `ChuaChot` / `ChoCheBien` / `DangCheBien` / `DaXong` / `DaPhucVu` / `DaHuy` | — |
| **Phiếu order** (`PhieuOrder.trang_thai`) | `DangPhucVu` / `DaThanhToan` / `DaHuy` | — |
| **Hình thức thanh toán** (`HoaDon.hinh_thuc_tt`) | `TienMat` / `ChuyenKhoan` | — |
| **Tài khoản** (`User.status`) | `HoatDong` / `DaKhoa` | — |
| **Vai trò** (`Role.role_id`) | `Admin` / `PhucVu` / `Bep` / `ThuNgan` / `Kho` | — |
| **Loại món** (`MonAn.loai_mon`) | `MonAn` / `DoUong` | Cũng chính là bộ phận xử lý (Món ăn → Bếp; Đồ uống → Quầy pha chế) |
| **Trạng thái món** (`MonAn.trang_thai`) | `ConHang` / `HetHang` | — |
| **Bộ phận nhận xuất kho** (`PhieuXuatKho.bo_phan_nhan`) | `Bep` / `QuayPhaChe` | — |

## 1.4. Phân chia module (chia việc theo nhóm)

Hệ thống chia thành **8 module gần như độc lập**. Mỗi module có ranh giới rõ ràng về bảng/endpoint/màn hình, cho phép các thành viên trong nhóm phụ trách độc lập từ thiết kế chi tiết đến triển khai.

| Module | Vai trò chính | Bảng sở hữu (R/W) | Bảng đọc từ module khác | Endpoint prefix |
|---|---|---|---|---|
| **M1. Xác thực + Tài khoản** | Đăng nhập/đăng xuất, quản lý tài khoản, middleware kiểm tra quyền | `Role` (R), `User` (R/W) | (không) | `/auth/*`, `/users/*` |
| **M2. Quản lý bàn** | CRUD bàn | `Ban` (R/W) | (không) | `/ban/*` |
| **M3. Thực đơn** | CRUD món | `MonAn` (R/W) | (không) | `/mon-an/*` |
| **M4. Đặt bàn** | Tạo, hủy, đánh dấu nhận bàn | `PhieuDatBan` (R/W) | `Ban` (R/W trạng thái) | `/dat-ban/*` |
| **M5. Order + Bếp** | Gọi món, chốt bếp, cập nhật trạng thái món, phục vụ ra bàn | `PhieuOrder` (R/W), `ChiTietOrder` (R/W) | `Ban` (R/W trạng thái), `MonAn` (R) | `/order/*` |
| **M6. Thanh toán** | Thanh toán, in lại hóa đơn, báo cáo doanh thu | `HoaDon` (R/W) | `PhieuOrder` (R/W trạng thái), `ChiTietOrder` (R) | `/thanh-toan/*`, `/hoa-don/*`, `/bao-cao/doanh-thu` |
| **M7. Kho** | NCC, NVL, nhập/xuất kho, báo cáo kho | `NhaCungCap` (R/W), `NguyenLieu` (R/W), `PhieuNhapKho` + `ChiTietNhapKho` (R/W), `PhieuXuatKho` + `ChiTietXuatKho` (R/W) | (không) | `/kho/*` |
| **M8. Báo cáo tổng hợp** | Dashboard Admin | Đọc cross-module | Tất cả | `/bao-cao/tong-hop` |

**Coupling thực tế giữa module:**
- M4 ↔ M2: cập nhật `Ban.trang_thai` khi đặt bàn / nhận bàn
- M5 ↔ M2: cập nhật `Ban.trang_thai` khi mở/đóng order
- M5 ↔ M3: đọc `MonAn` để hiện thực đơn + snapshot đơn giá
- M6 ↔ M5: đọc `PhieuOrder` + `ChiTietOrder` để tính tiền; ghi `PhieuOrder.trang_thai = 'DaThanhToan'`
- M8 đọc cross-module nhưng chỉ đọc

→ Mỗi cặp giao tiếp chỉ qua **trường FK + cột trạng thái cố định**. Hợp đồng giữa các module = §2 (schema CSDL) + §4 (API). Sau khi 2 file này được duyệt, các thành viên code song song được.

# 2. THIẾT KẾ CƠ SỞ DỮ LIỆU {#thiết-kế-cơ-sở-dữ-liệu}

## 2.1. Sơ đồ ERD

```mermaid
erDiagram
    Role         ||--o{ User           : "co"
    User         ||--o{ PhieuDatBan    : "tiep_nhan"
    User         ||--o{ PhieuOrder     : "phuc_vu"
    User         ||--o{ ChiTietOrder   : "xac_nhan_phuc_vu"
    User         ||--o{ HoaDon         : "thu_ngan"
    User         ||--o{ PhieuNhapKho   : "lap"
    User         ||--o{ PhieuXuatKho   : "lap"

    Ban          ||--o{ PhieuDatBan    : "duoc_dat"
    Ban          ||--o{ PhieuOrder     : "co_order"
    PhieuOrder   ||--o{ ChiTietOrder   : "gom"
    PhieuOrder   ||--o| HoaDon         : "tao_ra"
    MonAn        ||--o{ ChiTietOrder   : "duoc_chon"

    NhaCungCap   ||--o{ PhieuNhapKho     : "cung_cap"
    PhieuNhapKho ||--o{ ChiTietNhapKho   : "gom"
    NguyenLieu   ||--o{ ChiTietNhapKho   : "nhap"
    PhieuXuatKho ||--o{ ChiTietXuatKho   : "gom"
    NguyenLieu   ||--o{ ChiTietXuatKho   : "xuat"
```

## 2.2. Danh sách bảng (tổng quan)

| # | Tên bảng | Module | Vai trò chính | DFD tham chiếu |
|---|---|---|---|---|
| 1 | `Role` | M1 | Danh mục 5 vai trò người dùng | §7.5.3, §7.6.1 |
| 2 | `User` | M1 | Tài khoản nhân viên | §7.5.3, §7.6.1 |
| 3 | `Ban` | M2 | Danh sách bàn ăn | §7.1.x, §7.5.2 |
| 4 | `MonAn` | M3 | Thực đơn | §7.1.2, §7.5.1 |
| 5 | `PhieuDatBan` | M4 | Phiếu đặt bàn | §7.1.1 |
| 6 | `PhieuOrder` | M5 | Phiếu order theo bàn | §7.1.2, §7.2.1 |
| 7 | `ChiTietOrder` | M5 | Các dòng món trong order | §7.1.2, §7.1.3, §7.1.4, §7.3.x |
| 8 | `HoaDon` | M6 | Hóa đơn thanh toán | §7.2.1, §7.2.2, §7.2.3 |
| 9 | `NhaCungCap` | M7 | Nhà cung cấp NVL | §7.4.1 |
| 10 | `NguyenLieu` | M7 | Danh mục NVL + tồn kho hiện tại | §7.4.x |
| 11 | `PhieuNhapKho` | M7 | Phiếu nhập kho (header) | §7.4.1, §7.4.4 |
| 12 | `ChiTietNhapKho` | M7 | Dòng NVL trong phiếu nhập | §7.4.1, §7.4.4 |
| 13 | `PhieuXuatKho` | M7 | Phiếu xuất kho (header) | §7.4.3, §7.4.5 |
| 14 | `ChiTietXuatKho` | M7 | Dòng NVL trong phiếu xuất | §7.4.3, §7.4.5 |

(Đếm = 14 bảng vì NhapKho và XuatKho mỗi cái có thêm 1 bảng chi tiết; nhưng ở góc nhìn "thực thể nghiệp vụ", vẫn coi như 13 thực thể.)

## 2.3. Chi tiết từng bảng

### 2.3.1. `Role` (thực thể hệ thống — tên tiếng Anh)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `role_id` | NVARCHAR(10) | **PK** | `Admin` / `PhucVu` / `Bep` / `ThuNgan` / `Kho` (giá trị giữ TV) |
| `role_name` | NVARCHAR(50) | NOT NULL | Tên hiển thị (Vd "Quản lý") |
| `description` | NVARCHAR(200) | NULL | Mô tả vai trò |

Bảng tĩnh, 5 dòng, seed sẵn.

### 2.3.2. `User` (thực thể hệ thống — tên tiếng Anh)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `user_id` | INT IDENTITY(1,1) | **PK** | Mã NV tự sinh |
| `username` | NVARCHAR(50) | UNIQUE, NOT NULL | Tên đăng nhập (không dấu, không khoảng trắng) |
| `password_hash` | NVARCHAR(255) | NOT NULL | Hash bcrypt mật khẩu |
| `full_name` | NVARCHAR(100) | NOT NULL | Họ và tên NV |
| `role_id` | NVARCHAR(10) | FK → `Role.role_id`, NOT NULL | Vai trò gắn |
| `status` | NVARCHAR(20) | NOT NULL, CHECK IN (`'HoatDong'`,`'DaKhoa'`), DEFAULT `'HoatDong'` | Giá trị giữ TV |
| `failed_login_count` | TINYINT | NOT NULL, DEFAULT 0 | Tăng khi sai; reset khi đúng; ≥ 5 → khóa |
| `last_login_at` | DATETIME2 | NULL | Lúc đăng nhập thành công gần nhất |
| `created_at` | DATETIME2 | NOT NULL, DEFAULT SYSDATETIME() | |
| `updated_at` | DATETIME2 | NULL | |

**Index:** `IX_User_role (role_id)`.

> `User` là từ khóa SQL Server → trong câu lệnh SQL phải bao `[User]` (xem seed §2.5).

### 2.3.3. `Ban`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_ban` | INT IDENTITY(1,1) | **PK** | |
| `so_ban` | NVARCHAR(10) | UNIQUE, NOT NULL | Mã hiển thị (Vd `B01`) |
| `khu_vuc` | NVARCHAR(50) | NOT NULL | `Tầng 1`, `Sân vườn`… |
| `suc_chua` | INT | NOT NULL, CHECK (`suc_chua > 0`) | Số người tối đa |
| `trang_thai` | NVARCHAR(20) | NOT NULL, CHECK IN (`'Trong'`,`'DaDat'`,`'CoKhach'`), DEFAULT `'Trong'` | |
| `ghi_chu` | NVARCHAR(200) | NULL | |
| `dang_su_dung` | BIT | NOT NULL, DEFAULT 1 | Soft delete |

### 2.3.4. `MonAn`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_mon` | INT IDENTITY(1,1) | **PK** | |
| `ten_mon` | NVARCHAR(100) | UNIQUE, NOT NULL | |
| `loai_mon` | NVARCHAR(10) | NOT NULL, CHECK IN (`'MonAn'`,`'DoUong'`) | Đồng thời là phân luồng Bếp/Pha chế |
| `don_gia` | DECIMAL(15,0) | NOT NULL, CHECK (`don_gia >= 0`) | VND (không phần thập phân) |
| `trang_thai` | NVARCHAR(10) | NOT NULL, CHECK IN (`'ConHang'`,`'HetHang'`), DEFAULT `'ConHang'` | |
| `mo_ta` | NVARCHAR(500) | NULL | |
| `dang_su_dung` | BIT | NOT NULL, DEFAULT 1 | Soft delete |

### 2.3.5. `PhieuDatBan`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_dat_ban` | INT IDENTITY(1,1) | **PK** | Đây cũng là "Mã đặt bàn" in trên PV_BM1 |
| `ma_ban` | INT | FK → `Ban.ma_ban`, NOT NULL | |
| `ten_khach` | NVARCHAR(100) | NOT NULL | |
| `so_dien_thoai` | NVARCHAR(15) | NOT NULL | |
| `so_nguoi` | INT | NOT NULL, CHECK (`so_nguoi > 0`) | Kiểm tra ≤ `Ban.suc_chua` ở service |
| `thoi_gian_dat` | DATETIME2 | NOT NULL | Khung giờ khách hẹn |
| `hinh_thuc_dat` | NVARCHAR(20) | NOT NULL, CHECK IN (`'TrucTiep'`,`'QuaDienThoai'`) | |
| `ghi_chu` | NVARCHAR(500) | NULL | |
| `nv_tiep_nhan` | INT | FK → `User.user_id`, NOT NULL | |
| `trang_thai` | NVARCHAR(20) | NOT NULL, CHECK IN (`'DaDat'`,`'DaNhanBan'`,`'DaHuy'`), DEFAULT `'DaDat'` | |
| `thoi_gian_tao` | DATETIME2 | NOT NULL, DEFAULT SYSDATETIME() | |
| `thoi_gian_nhan_ban` | DATETIME2 | NULL | Lúc Phục vụ bấm "Đã nhận bàn" |
| `thoi_gian_huy` | DATETIME2 | NULL | |

**Index:** `IX_PhieuDatBan_ban_thoigian (ma_ban, thoi_gian_dat)`.

### 2.3.6. `PhieuOrder`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_order` | INT IDENTITY(1,1) | **PK** | |
| `ma_ban` | INT | FK → `Ban.ma_ban`, NOT NULL | |
| `nv_phuc_vu` | INT | FK → `User.user_id`, NOT NULL | NV mở order |
| `thoi_gian_tao` | DATETIME2 | NOT NULL, DEFAULT SYSDATETIME() | |
| `trang_thai` | NVARCHAR(20) | NOT NULL, CHECK IN (`'DangPhucVu'`,`'DaThanhToan'`,`'DaHuy'`), DEFAULT `'DangPhucVu'` | |
| `tong_tam_tinh` | DECIMAL(15,0) | NOT NULL, DEFAULT 0 | Cập nhật khi thêm/sửa/hủy dòng |

**Index:** `IX_PhieuOrder_ban_trangthai (ma_ban, trang_thai)`.

### 2.3.7. `ChiTietOrder`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_chi_tiet` | BIGINT IDENTITY(1,1) | **PK** | |
| `ma_order` | INT | FK → `PhieuOrder.ma_order`, NOT NULL | |
| `ma_mon` | INT | FK → `MonAn.ma_mon`, NOT NULL | |
| `so_luong` | INT | NOT NULL, CHECK (`so_luong > 0`) | |
| `don_gia` | DECIMAL(15,0) | NOT NULL | **Snapshot** giá tại thời điểm gọi |
| `thanh_tien` | DECIMAL(15,0) | NOT NULL, AS (`so_luong * don_gia`) PERSISTED | Cột tính, lưu vật lý |
| `ghi_chu` | NVARCHAR(200) | NULL | |
| `trang_thai` | NVARCHAR(20) | NOT NULL, CHECK IN (`'ChuaChot'`,`'ChoCheBien'`,`'DangCheBien'`,`'DaXong'`,`'DaPhucVu'`,`'DaHuy'`), DEFAULT `'ChuaChot'` | |
| `thoi_gian_tao` | DATETIME2 | NOT NULL, DEFAULT SYSDATETIME() | |
| `thoi_gian_chot` | DATETIME2 | NULL | Lúc chuyển `ChuaChot` → `ChoCheBien` (chốt sang bếp) |
| `thoi_gian_xong` | DATETIME2 | NULL | Lúc chuyển → `DaXong` |
| `thoi_gian_phuc_vu` | DATETIME2 | NULL | Lúc chuyển → `DaPhucVu` |
| `nv_phuc_vu_xac_nhan` | INT | FK → `User.user_id`, NULL | NV xác nhận đã đem ra bàn |

**Index:**
- `IX_ChiTietOrder_order (ma_order)`
- `IX_ChiTietOrder_trangthai_chot (trang_thai, thoi_gian_chot)` — FIFO Bếp

**Ghi chú:** Không có bảng `PhieuChuyenBep` riêng. "Phiếu chuyển bếp" PV_BM3 là document sinh trên-bay từ:
```sql
SELECT * FROM ChiTietOrder ct JOIN MonAn m ON ct.ma_mon = m.ma_mon
WHERE ct.ma_order = @order AND ct.trang_thai = 'ChoCheBien'
  AND m.loai_mon = @bo_phan  -- 'MonAn' → Bếp; 'DoUong' → Quầy pha chế
ORDER BY ct.thoi_gian_chot;
```

### 2.3.8. `HoaDon`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_hoa_don` | INT IDENTITY(1,1) | **PK** | |
| `so_hoa_don` | NVARCHAR(20) | UNIQUE, NOT NULL | Vd `HD20260529-00001` (sinh ở service) |
| `ma_order` | INT | FK → `PhieuOrder.ma_order`, UNIQUE, NOT NULL | 1 order ↔ 1 hóa đơn |
| `so_ban_snapshot` | NVARCHAR(10) | NOT NULL | Snapshot `Ban.so_ban` |
| `nv_thu_ngan` | INT | FK → `User.user_id`, NOT NULL | |
| `tong_tien_mon` | DECIMAL(15,0) | NOT NULL | ∑(SL × đơn giá) |
| `ty_le_vat` | DECIMAL(5,4) | NOT NULL, DEFAULT 0.1 | Snapshot (mặc định 0.1 = 10%) |
| `tien_vat` | DECIMAL(15,0) | NOT NULL, DEFAULT 0 | ROUND(`tong_tien_mon * ty_le_vat`, 0) |
| `tong_thanh_toan` | DECIMAL(15,0) | NOT NULL | `tong_tien_mon + tien_vat` |
| `hinh_thuc_tt` | NVARCHAR(20) | NOT NULL, CHECK IN (`'TienMat'`,`'ChuyenKhoan'`) | |
| `tien_khach_dua` | DECIMAL(15,0) | NULL | NULL khi `ChuyenKhoan` |
| `tien_thua` | DECIMAL(15,0) | NOT NULL, DEFAULT 0 | 0 khi `ChuyenKhoan` |
| `ma_giao_dich` | NVARCHAR(100) | NULL | Mã/đường dẫn ảnh giao dịch CK (tùy chọn) |
| `thoi_gian_tao` | DATETIME2 | NOT NULL, DEFAULT SYSDATETIME() | |
| `so_lan_in` | INT | NOT NULL, DEFAULT 0 | ≥ 2 → đánh dấu "BẢN SAO" trên bản in |

**Index:** `IX_HoaDon_thoigian (thoi_gian_tao DESC)`.

### 2.3.9. `NhaCungCap`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_ncc` | INT IDENTITY(1,1) | **PK** | |
| `ten_ncc` | NVARCHAR(150) | UNIQUE, NOT NULL | |
| `so_dien_thoai` | NVARCHAR(15) | NULL | |
| `dia_chi` | NVARCHAR(300) | NULL | |
| `dang_su_dung` | BIT | NOT NULL, DEFAULT 1 | |

### 2.3.10. `NguyenLieu`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_nvl` | INT IDENTITY(1,1) | **PK** | |
| `ten_nvl` | NVARCHAR(100) | UNIQUE, NOT NULL | |
| `don_vi_tinh` | NVARCHAR(20) | NOT NULL | `kg`, `lit`, `goi`, `chai`… |
| `ton_hien_tai` | DECIMAL(15,3) | NOT NULL, DEFAULT 0, CHECK (`ton_hien_tai >= 0`) | Tồn real-time, cập nhật trong transaction nhập/xuất |
| `thoi_gian_cap_nhat_ton` | DATETIME2 | NULL | Lần tồn thay đổi gần nhất |
| `dang_su_dung` | BIT | NOT NULL, DEFAULT 1 | |

### 2.3.11. `PhieuNhapKho`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_phieu_nhap` | INT IDENTITY(1,1) | **PK** | |
| `so_phieu` | NVARCHAR(20) | UNIQUE, NOT NULL | Vd `PN20260529-001` |
| `ma_ncc` | INT | FK → `NhaCungCap.ma_ncc`, NOT NULL | |
| `nv_lap` | INT | FK → `User.user_id`, NOT NULL | |
| `ngay_nhap` | DATE | NOT NULL | |
| `tong_gia_tri` | DECIMAL(15,0) | NOT NULL | ∑(SL × đơn giá) |
| `ghi_chu` | NVARCHAR(500) | NULL | |
| `thoi_gian_tao` | DATETIME2 | NOT NULL, DEFAULT SYSDATETIME() | |

**Index:** `IX_PhieuNhapKho_ngay (ngay_nhap)`.

### 2.3.12. `ChiTietNhapKho`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_chi_tiet` | BIGINT IDENTITY(1,1) | **PK** | |
| `ma_phieu_nhap` | INT | FK → `PhieuNhapKho.ma_phieu_nhap`, NOT NULL, ON DELETE CASCADE | |
| `ma_nvl` | INT | FK → `NguyenLieu.ma_nvl`, NOT NULL | |
| `so_luong` | DECIMAL(15,3) | NOT NULL, CHECK (`so_luong > 0`) | |
| `don_gia` | DECIMAL(15,0) | NOT NULL, CHECK (`don_gia > 0`) | |
| `thanh_tien` | DECIMAL(15,0) | NOT NULL, AS (`so_luong * don_gia`) PERSISTED | |
| `ghi_chu` | NVARCHAR(200) | NULL | |

### 2.3.13. `PhieuXuatKho`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_phieu_xuat` | INT IDENTITY(1,1) | **PK** | |
| `so_phieu` | NVARCHAR(20) | UNIQUE, NOT NULL | Vd `PX20260529-001` |
| `bo_phan_nhan` | NVARCHAR(20) | NOT NULL, CHECK IN (`'Bep'`,`'QuayPhaChe'`) | |
| `nv_lap` | INT | FK → `User.user_id`, NOT NULL | |
| `ngay_xuat` | DATE | NOT NULL | |
| `tong_gia_tri` | DECIMAL(15,0) | NOT NULL | |
| `ghi_chu` | NVARCHAR(500) | NULL | |
| `thoi_gian_tao` | DATETIME2 | NOT NULL, DEFAULT SYSDATETIME() | |

**Index:** `IX_PhieuXuatKho_ngay (ngay_xuat)`.

### 2.3.14. `ChiTietXuatKho`

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ma_chi_tiet` | BIGINT IDENTITY(1,1) | **PK** | |
| `ma_phieu_xuat` | INT | FK → `PhieuXuatKho.ma_phieu_xuat`, NOT NULL, ON DELETE CASCADE | |
| `ma_nvl` | INT | FK → `NguyenLieu.ma_nvl`, NOT NULL | |
| `so_luong` | DECIMAL(15,3) | NOT NULL, CHECK (`so_luong > 0`) | |
| `don_gia` | DECIMAL(15,0) | NOT NULL, CHECK (`don_gia > 0`) | |
| `thanh_tien` | DECIMAL(15,0) | NOT NULL, AS (`so_luong * don_gia`) PERSISTED | |
| `ghi_chu` | NVARCHAR(200) | NULL | |

## 2.4. Ràng buộc cấp ứng dụng

| # | Ràng buộc | Module | Cách xử lý |
|---|---|---|---|
| 1 | `PhieuDatBan.so_nguoi ≤ Ban.suc_chua` | M4 | Kiểm tra trước INSERT |
| 2 | Chỉ tạo `PhieuOrder` mới khi `Ban.trang_thai IN ('Trong','CoKhach')`. Nếu `DaDat` → yêu cầu Phục vụ bấm "Đã nhận bàn" trước | M5 | Kiểm tra trước INSERT |
| 3 | `ChiTietXuatKho.so_luong ≤ NguyenLieu.ton_hien_tai` tại thời điểm lưu | M7 | Transaction + check trước UPDATE tồn |
| 4 | Chỉ cho thanh toán `PhieuOrder` khi mọi `ChiTietOrder.trang_thai IN ('DaPhucVu','DaHuy')` | M6 | SQL check trước INSERT `HoaDon` |
| 5 | Chuyển trạng thái `ChiTietOrder` tuần tự (`ChoCheBien → DangCheBien → DaXong → DaPhucVu`), không bỏ bước | M5 | State machine ở tầng service |
| 6 | Cập nhật `NguyenLieu.ton_hien_tai` và INSERT phiếu kho trong CÙNG transaction | M7 | `BEGIN TRAN` … `COMMIT` |
| 7 | Khóa tài khoản khi `User.failed_login_count ≥ 5` | M1 | Sau mỗi lần sai |
| 8 | Đặt bàn / nhận bàn / thanh toán: đồng bộ `Ban.trang_thai` trong cùng transaction với phiếu | M2 (cross-call) | Hàm dùng chung |

## 2.5. Dữ liệu seed mẫu

```sql
-- 1. Role (cố định)
INSERT INTO Role (role_id, role_name, description) VALUES
('Admin',   N'Quản lý',       N'Quản lý toàn hệ thống'),
('PhucVu',  N'Phục vụ',       N'Tiếp nhận đặt bàn, gọi món, phục vụ'),
('Bep',     N'Bộ phận Bếp',   N'Chế biến món ăn / đồ uống'),
('ThuNgan', N'Thu ngân',      N'Thanh toán, xuất hóa đơn'),
('Kho',     N'Bộ phận Kho',   N'Nhập / xuất / báo cáo kho');

-- 2. User (mật khẩu mặc định = 'matkhau123', đã hash bcrypt cost 10)
INSERT INTO [User] (username, password_hash, full_name, role_id) VALUES
('admin',    '$2b$10$EXAMPLEHASHADMIN........................', N'Quản trị viên', 'Admin'),
('phucvu1',  '$2b$10$EXAMPLEHASHPHUCVU.......................', N'Nguyễn Văn A',   'PhucVu'),
('bep1',     '$2b$10$EXAMPLEHASHBEP..........................', N'Trần Thị B',     'Bep'),
('thungan1', '$2b$10$EXAMPLEHASHTHUNGAN......................', N'Lê Văn C',       'ThuNgan'),
('kho1',     '$2b$10$EXAMPLEHASHKHO..........................', N'Phạm Thị D',     'Kho');

-- 3. Ban
INSERT INTO Ban (so_ban, khu_vuc, suc_chua) VALUES
(N'B01',   N'Tầng 1',     4),
(N'B02',   N'Tầng 1',     6),
(N'B03',   N'Tầng 2',     4),
(N'B04',   N'Tầng 2',     6),
(N'SV01',  N'Sân vườn',   8),
(N'VIP01', N'Phòng VIP', 10);

-- 4. MonAn
INSERT INTO MonAn (ten_mon, loai_mon, don_gia, mo_ta) VALUES
(N'Phở bò',          'MonAn',  60000, N'Phở bò tái nạm'),
(N'Bún chả',         'MonAn',  55000, N'Bún chả Hà Nội'),
(N'Cơm gà xối mỡ',   'MonAn',  50000, N''),
(N'Lẩu thái',        'MonAn', 250000, N'Phục vụ 4 người'),
(N'Trà đá',          'DoUong',  5000, N''),
(N'Cà phê đen đá',   'DoUong', 25000, N''),
(N'Nước cam tươi',   'DoUong', 30000, N''),
(N'Bia Heineken',    'DoUong', 35000, N'Chai 330ml');

-- 5. NhaCungCap & NguyenLieu (chỉ phục vụ cho M7 demo)
INSERT INTO NhaCungCap (ten_ncc, so_dien_thoai, dia_chi) VALUES
(N'Cty Thực phẩm An Bình',  N'0901234567', N'Quận 1, TP.HCM'),
(N'Đồ uống Sài Gòn',         N'0907654321', N'Quận 3, TP.HCM');

INSERT INTO NguyenLieu (ten_nvl, don_vi_tinh, ton_hien_tai) VALUES
(N'Thịt bò',      N'kg',    20.0),
(N'Bún tươi',     N'kg',    15.0),
(N'Gạo tẻ',       N'kg',   100.0),
(N'Cà phê hạt',   N'kg',    10.0),
(N'Bia Heineken', N'thùng',  5.0);
```

## 2.6. Hằng số hệ thống (tệp `config/constants.js`)

Thay cho bảng `CauHinh` đã loại bỏ:

```javascript
module.exports = {
  // Thông tin nhà hàng (in trên hóa đơn TN_BM3 — thay cho bảng CauHinh đã cắt)
  NHA_HANG: {
    ten: 'Nhà hàng ABC',
    dia_chi: '123 Đường XYZ, Quận 1, TP.HCM',
    so_dien_thoai: '028 1234 5678',
    ma_so_thue: '0312345678',
  },

  // Thanh toán
  VAT_TY_LE: 0.10,            // 10%

  // Phiên đăng nhập
  PHIEN_DANG_NHAP_PHUT: 30,   // JWT hết hạn sau 30 phút không dùng
  SO_LAN_SAI_TOI_DA: 5,       // Khóa tài khoản sau 5 lần sai

  // Giờ hoạt động (kiểm tra khi đặt bàn / gọi món)
  GIO_MO: '08:00',
  GIO_DONG: '22:00',

  // Báo cáo
  TOP_N_BAO_CAO: 10,          // Số món bán chạy trong dashboard
};
```

---

> **Kết thúc Đợt D1.** Schema 13 thực thể (14 bảng) chia 8 module gần như độc lập.

# 4. THIẾT KẾ API {#thiết-kế-api}

> Đợt D3 (UI mockup) sẽ chèn vào **§3** sau. API đặt ở **§4** để khớp tham chiếu trong sơ đồ kiến trúc §1.1.
>
> Mỗi endpoint ghi rõ **vai trò** được phép và **DFD tham chiếu** (§7 trong `DESCRIPTION.md`) để chứng minh không phát sinh chức năng ngoài đặc tả. Phần này là **D2a** (module M1–M4); M5–M8 ở D2b.

## 4.0. Quy ước chung cho mọi API

**Prefix:** mọi endpoint nằm dưới `/api/v1`. Ví dụ `/api/v1/auth/login`. Bên dưới viết tắt bỏ prefix.

**Xác thực:** trừ `POST /auth/login`, mọi endpoint yêu cầu header `Authorization: Bearer <JWT>`. Middleware `authenticate` giải mã token, kiểm tra `User.status = 'HoatDong'` mỗi request (cơ chế thu hồi sớm, xem §7.6.1 ghi chú). Middleware `authorize(...roles)` chặn vai trò không hợp lệ. (Hai middleware này thuộc thực thể hệ thống nên đặt tên tiếng Anh; các hàm nghiệp vụ vẫn PascalCase TV như `CapNhatTrangThaiBan`.)

**Định dạng response (envelope thống nhất):**
```jsonc
// Thành công
{ "success": true, "data": <object | array>, "message": "Mô tả ngắn (tùy chọn)" }
// Thất bại
{ "success": false, "error": { "code": "MA_LOI", "message": "Mô tả lỗi cho người dùng" } }
```

**Mã HTTP dùng trong hệ thống:**

| Mã | Khi nào |
|---|---|
| `200 OK` | Đọc / cập nhật thành công |
| `201 Created` | Tạo mới thành công (trả bản ghi vừa tạo) |
| `400 Bad Request` | Sai/thiếu dữ liệu đầu vào, vi phạm quy định nghiệp vụ (vd số người > sức chứa) |
| `401 Unauthorized` | Thiếu/sai/hết hạn JWT |
| `403 Forbidden` | Vai trò không có quyền với chức năng |
| `404 Not Found` | Không tìm thấy bản ghi |
| `409 Conflict` | Trùng dữ liệu duy nhất (vd tên đăng nhập, số bàn) hoặc xung đột trạng thái (vd thanh toán bàn chưa phục vụ xong) |

**Mã lỗi nghiệp vụ (`error.code`)** dùng chung:

| `code` | Ý nghĩa |
|---|---|
| `VALIDATION` | Dữ liệu đầu vào không hợp lệ |
| `NOT_FOUND` | Không tìm thấy |
| `DUPLICATE` | Trùng trường duy nhất |
| `CONFLICT_STATE` | Sai trạng thái cho thao tác |
| `UNAUTHORIZED` / `FORBIDDEN` | Lỗi xác thực / phân quyền |
| `RULE_VIOLATION` | Vi phạm quy định nghiệp vụ (PV_QĐ1, TN_QĐ1, B_QĐ1, K_QĐ1, QL_QĐ1) |

**Danh sách:** các endpoint `GET` trả danh sách trả thẳng mảng trong `data`, **không phân trang** (quy mô 1 nhà hàng, đủ dùng). Lọc qua query string.

**Trường JSON:** trùng tên cột DB (snake_case TV). Thời gian trả ISO-8601.

---

## 4.1. Module M1 — Xác thực + Tài khoản

Base: `/auth/*`, `/users/*`. Bảng: `User` (R/W), `Role` (R). DFD: §7.6.1 (đăng nhập), §7.5.3 (quản lý tài khoản). Đây là thực thể hệ thống → endpoint, trường JSON dùng **tiếng Anh** (giá trị enum vai trò/trạng thái giữ TV).

### 4.1.1. Đăng nhập / Đăng xuất (DFD §7.6.1)

| Method | Endpoint | Vai trò | Mô tả |
|---|---|---|---|
| POST | `/auth/login` | Công khai | Đăng nhập, trả JWT |
| GET | `/auth/me` | Mọi vai trò | Lấy thông tin user hiện tại từ token |
| POST | `/auth/logout` | Mọi vai trò | Vô hiệu phía client (xóa token). Server stateless, chỉ trả 200 |

**`POST /auth/login`** — Request:
```json
{ "username": "phucvu1", "password": "matkhau123" }
```
Xử lý (theo §7.6.1 Bước 2–6): tìm user theo `username`; nếu không tồn tại / `status='DaKhoa'` → `401`. So khớp bcrypt; sai → `failed_login_count++`, nếu ≥ `SO_LAN_SAI_TOI_DA` thì khóa, trả `401`. Đúng → reset số lần sai, cập nhật `last_login_at`, ký JWT (payload `user_id`, `role_id`; hạn `now + PHIEN_DANG_NHAP_PHUT` phút).

Response `200`:
```json
{ "success": true, "data": {
  "token": "<JWT>",
  "user": { "user_id": 2, "full_name": "Nguyễn Văn A", "username": "phucvu1", "role_id": "PhucVu" }
}}
```
Lỗi: sai tài khoản/mật khẩu → `401 UNAUTHORIZED` ("Tên đăng nhập hoặc mật khẩu không đúng"); bị khóa → `401 UNAUTHORIZED` ("Tài khoản đã bị khóa, liên hệ Admin").

### 4.1.2. Quản lý tài khoản — Admin (DFD §7.5.3, QL_BM3)

Tất cả yêu cầu vai trò **Admin**. Tuân QL_QĐ1.

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/users` | Danh sách tài khoản. Query lọc: `?role_id=&status=&q=` (`q` tìm theo họ tên/tên đăng nhập) |
| GET | `/users/:id` | Chi tiết 1 tài khoản (không trả `password_hash`) |
| POST | `/users` | Tạo tài khoản mới |
| PUT | `/users/:id` | Sửa họ tên / vai trò |
| PATCH | `/users/:id/lock` | Khóa (`status='DaKhoa'`) |
| PATCH | `/users/:id/unlock` | Mở khóa (`status='HoatDong'`, reset `failed_login_count=0`) |
| PATCH | `/users/:id/reset-password` | Đặt lại mật khẩu |

**`POST /users`** — Request:
```json
{ "username": "phucvu2", "password": "matkhau123", "full_name": "Trần Văn E", "role_id": "PhucVu" }
```
Kiểm tra (QL_QĐ1, §7.5.3 Bước 4): `username` không trùng (→ `409 DUPLICATE`); `password` ≥ 8 ký tự, có cả chữ và số (→ `400 RULE_VIOLATION`); `role_id` ∈ 5 vai trò. Băm bcrypt cost 10 trước khi lưu. Trả `201` bản ghi (ẩn hash).

**`PATCH /users/:id/lock`** — chặn Admin tự khóa chính mình (`id === token.user_id` → `400 RULE_VIOLATION`).

**`PATCH /users/:id/reset-password`** — Request `{ "new_password": "..." }`, cùng quy tắc độ mạnh; băm và lưu, reset `failed_login_count=0`.

> Không có endpoint tự đổi mật khẩu cho vai trò khác (ngoài phạm vi — chỉ Admin quản lý theo §7.5.3). Không có chức năng "Quên mật khẩu" tự động (nút trong SYS_BM1 chỉ hiển thị hướng dẫn liên hệ Admin).

---

## 4.2. Module M2 — Quản lý bàn

Base: `/ban/*`. Bảng: `Ban` (R/W). DFD: §7.5.2 (QL_BM2). CRUD do **Admin**; danh sách bàn được **Phục vụ/Thu ngân đọc** (chọn bàn khi đặt/gọi món/thanh toán).

| Method | Endpoint | Vai trò | Mô tả |
|---|---|---|---|
| GET | `/ban` | Admin, PhucVu, ThuNgan | Danh sách bàn `dang_su_dung=1`. Query: `?trang_thai=&khu_vuc=` |
| GET | `/ban/:id` | Admin, PhucVu, ThuNgan | Chi tiết bàn |
| POST | `/ban` | Admin | Thêm bàn |
| PUT | `/ban/:id` | Admin | Sửa số bàn / khu vực / sức chứa / ghi chú |
| DELETE | `/ban/:id` | Admin | Xóa mềm (`dang_su_dung=0`) |

**`POST /ban`** — Request `{ "so_ban": "B07", "khu_vuc": "Tầng 2", "suc_chua": 4, "ghi_chu": "" }`. Kiểm tra (§7.5.2 Bước 4): `so_ban` không trùng (→ `409`); `suc_chua > 0`. Trạng thái khởi tạo `'Trong'`.

**`DELETE /ban/:id`** — chỉ cho xóa khi `trang_thai='Trong'` (§7.5.2 Bước 4: bàn đang `DaDat`/`CoKhach` → `409 CONFLICT_STATE`). Xóa mềm để giữ toàn vẹn FK với phiếu cũ.

> `Ban.trang_thai` **không** đổi qua endpoint M2; nó do M4 (đặt/nhận bàn) và M5/M6 (mở order/thanh toán) đổi qua hàm dùng chung `CapNhatTrangThaiBan` (pseudocode ở D4). M2 chỉ quản trị danh mục bàn.

---

## 4.3. Module M3 — Thực đơn

Base: `/mon-an/*`. Bảng: `MonAn` (R/W). DFD: §7.5.1 (QL_BM1). CRUD do **Admin**; danh sách món được **Phục vụ đọc** (màn gọi món).

| Method | Endpoint | Vai trò | Mô tả |
|---|---|---|---|
| GET | `/mon-an` | Admin, PhucVu | Danh sách món `dang_su_dung=1`. Query: `?loai_mon=&trang_thai=&tu_khoa=` |
| GET | `/mon-an/:id` | Admin, PhucVu | Chi tiết món |
| POST | `/mon-an` | Admin | Thêm món |
| PUT | `/mon-an/:id` | Admin | Sửa tên / loại / đơn giá / mô tả |
| PATCH | `/mon-an/:id/trang-thai` | Admin | Đổi `ConHang`↔`HetHang` |
| DELETE | `/mon-an/:id` | Admin | Xóa mềm (`dang_su_dung=0`) |

**`POST /mon-an`** — Request `{ "ten_mon": "Gỏi cuốn", "loai_mon": "MonAn", "don_gia": 40000, "mo_ta": "" }`. Kiểm tra (§7.5.1 Bước 4): `ten_mon` không trùng (→ `409`); `don_gia >= 0`; `loai_mon ∈ ('MonAn','DoUong')`. Trạng thái khởi tạo `'ConHang'`.

**`PATCH /mon-an/:id/trang-thai`** — Request `{ "trang_thai": "HetHang" }`. Phục vụ khi gọi món chỉ thấy món `ConHang` (lọc ở M5).

> Đơn giá sửa ở đây **không hồi tố** order cũ — M5 đã snapshot `don_gia` vào `ChiTietOrder` (xem §2 quyết định kỹ thuật). Đổi giá chỉ ảnh hưởng order tạo về sau.

---

## 4.4. Module M4 — Đặt bàn

Base: `/dat-ban/*`. Bảng: `PhieuDatBan` (R/W), `Ban` (R + đổi trạng thái). DFD: §7.1.1 (tiếp nhận đặt bàn, PV_BM1) + ghi chú "nhận bàn" (§7.1.1, §7.1.2). Vai trò **PhucVu** (Admin xem được).

| Method | Endpoint | Vai trò | Mô tả |
|---|---|---|---|
| GET | `/dat-ban` | PhucVu, Admin | Danh sách phiếu đặt. Query: `?trang_thai=&ngay=&tu_khoa=` (SĐT/tên/mã đặt) |
| GET | `/dat-ban/:id` | PhucVu, Admin | Chi tiết phiếu đặt (theo PV_BM1) |
| POST | `/dat-ban` | PhucVu | Tiếp nhận đặt bàn mới |
| POST | `/dat-ban/:id/nhan-ban` | PhucVu | Đánh dấu khách đến (check-in thủ công) |
| POST | `/dat-ban/:id/huy` | PhucVu | Hủy phiếu đặt |

**`POST /dat-ban`** (DFD §7.1.1 Bước 3–7) — Request:
```json
{ "ma_ban": 3, "ten_khach": "Nguyễn Văn A", "so_dien_thoai": "0901234567",
  "so_nguoi": 4, "thoi_gian_dat": "2026-05-29T18:30:00", "hinh_thuc_dat": "QuaDienThoai", "ghi_chu": "" }
```
Kiểm tra (PV_QĐ1): bàn tồn tại & `trang_thai='Trong'` (→ `409 CONFLICT_STATE` nếu `DaDat`/`CoKhach`); `so_nguoi > 0` và `≤ Ban.suc_chua` (→ `400 RULE_VIOLATION`); `thoi_gian_dat` trong `[GIO_MO, GIO_DONG]` (→ `400 RULE_VIOLATION`); `hinh_thuc_dat ∈ ('TrucTiep','QuaDienThoai')`. **Transaction**: INSERT `PhieuDatBan` (`trang_thai='DaDat'`, `nv_tiep_nhan` = user token) + `Ban.trang_thai='DaDat'`. Trả `201` kèm `ma_dat_ban` (chính là "Mã đặt bàn" trên PV_BM1).

**`POST /dat-ban/:id/nhan-ban`** (ghi chú §7.1.1 — khách đến) — không cần body. Điều kiện: phiếu `trang_thai='DaDat'` (→ `409` nếu khác). **Transaction**: `PhieuDatBan.trang_thai='DaNhanBan'` + `thoi_gian_nhan_ban=now` + `Ban.trang_thai='CoKhach'`. Sau bước này Phục vụ mới gọi món được (M5 yêu cầu bàn `Trong`/`CoKhach`).

**`POST /dat-ban/:id/huy`** — điều kiện phiếu `trang_thai='DaDat'`. **Transaction**: `PhieuDatBan.trang_thai='DaHuy'` + `thoi_gian_huy=now` + trả `Ban.trang_thai='Trong'`. Không hủy phiếu `DaNhanBan` (khách đã tới — đã chuyển sang luồng order).

> Đồng bộ `Ban.trang_thai` luôn nằm **cùng transaction** với thay đổi phiếu (ràng buộc §2.4 #8), qua hàm dùng chung `CapNhatTrangThaiBan`. Không có hủy tự động sau 15 phút (yêu cầu Tiến hóa §6 — ngoài phạm vi).

---

> **Kết thúc D2a (M1–M4).** Quy ước chung §4.0 + API 4 module quản trị/đầu luồng, mỗi endpoint gắn DFD tham chiếu. Sau khi bạn review, tôi viết **D2b**: M5 (Order+Bếp §7.1.2/7.1.3/7.1.4/7.3), M6 (Thanh toán §7.2), M7 (Kho §7.4), M8 (Báo cáo tổng hợp §7.5.4) — đây là phần nghiệp vụ lõi, nhiều transaction & state machine.
