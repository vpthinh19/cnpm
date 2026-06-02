/* ---------------------------------------------------------------------
   1. XÓA BẢNG CŨ (nếu chạy lại) — theo thứ tự phụ thuộc ngược
   --------------------------------------------------------------------- */
DROP TABLE IF EXISTS "ChiTietXuatKho" CASCADE;
DROP TABLE IF EXISTS "PhieuXuatKho"   CASCADE;
DROP TABLE IF EXISTS "ChiTietNhapKho" CASCADE;
DROP TABLE IF EXISTS "PhieuNhapKho"   CASCADE;
DROP TABLE IF EXISTS "ChiTietHoaDon"  CASCADE;
DROP TABLE IF EXISTS "HoaDon"         CASCADE;
DROP TABLE IF EXISTS "ChiTietOrder"   CASCADE;
DROP TABLE IF EXISTS "PhieuOrder"     CASCADE;
DROP TABLE IF EXISTS "PhieuDatBan"    CASCADE;
DROP TABLE IF EXISTS "NguyenLieu"     CASCADE;
DROP TABLE IF EXISTS "NhaCungCap"     CASCADE;
DROP TABLE IF EXISTS "MonAn"          CASCADE;
DROP TABLE IF EXISTS "Ban"            CASCADE;
DROP TABLE IF EXISTS "User"           CASCADE;
DROP TABLE IF EXISTS "Role"           CASCADE;

/* =====================================================================
   2. TẠO BẢNG
   ===================================================================== */

/* ---- M1: Xác thực + Tài khoản ---- */
CREATE TABLE "Role" (
    "RoleID"       VARCHAR(10)   NOT NULL PRIMARY KEY,   -- Admin/PhucVu/Bep/ThuNgan/Kho
    "RoleName"     VARCHAR(50)   NOT NULL,
    "Description"  VARCHAR(200)  NULL
);

CREATE TABLE "User" (
    "UserID"            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "Username"          VARCHAR(50)  NOT NULL UNIQUE,
    "PasswordHash"      VARCHAR(255) NOT NULL,
    "FullName"          VARCHAR(100) NOT NULL,
    "RoleID"            VARCHAR(10)  NOT NULL,
    "Status"            VARCHAR(20)  NOT NULL DEFAULT 'HoatDong'
                        CONSTRAINT ck_user_status CHECK ("Status" IN ('HoatDong','DaKhoa')),
    "FailedLoginCount"  SMALLINT     NOT NULL DEFAULT 0,
    "LastLoginAt"       TIMESTAMP    NULL,
    "CreatedAt"         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt"         TIMESTAMP    NULL,
    CONSTRAINT fk_user_role FOREIGN KEY ("RoleID") REFERENCES "Role"("RoleID")
);
CREATE INDEX ix_user_role ON "User"("RoleID");

/* ---- M2: Quản lý bàn ---- */
CREATE TABLE "Ban" (
    "BanID"       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "MaBan"       VARCHAR(10)  NOT NULL UNIQUE,
    "KhuVuc"      VARCHAR(50)  NOT NULL,
    "SucChua"     INT          NOT NULL CONSTRAINT ck_ban_succhua CHECK ("SucChua" > 0),
    "TrangThai"   VARCHAR(20)  NOT NULL DEFAULT 'Trong'
                  CONSTRAINT ck_ban_trangthai CHECK ("TrangThai" IN ('Trong','DaDat','CoKhach')),
    "GhiChu"      VARCHAR(200) NULL,
    "DangSuDung"  BOOLEAN      NOT NULL DEFAULT TRUE
);

/* ---- M3: Thực đơn ---- */
CREATE TABLE "MonAn" (
    "MonAnID"     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "MaSanPham"   VARCHAR(20)   NOT NULL UNIQUE,   -- mã theo sổ sách (vd SP000221)
    "TenMon"      VARCHAR(100)  NOT NULL UNIQUE,
    "LoaiMon"     VARCHAR(10)   NOT NULL
                  CONSTRAINT ck_monan_loaimon CHECK ("LoaiMon" IN ('MonAn','DoUong')),
    "DonGia"      NUMERIC(15,0) NOT NULL CONSTRAINT ck_monan_dongia CHECK ("DonGia" >= 0),
    "TrangThai"   VARCHAR(10)   NOT NULL DEFAULT 'ConHang'
                  CONSTRAINT ck_monan_trangthai CHECK ("TrangThai" IN ('ConHang','HetHang')),
    "MoTa"        VARCHAR(500)  NULL,
    "DangSuDung"  BOOLEAN       NOT NULL DEFAULT TRUE
);

/* ---- M4: Đặt bàn ---- */
CREATE TABLE "PhieuDatBan" (
    "PhieuDatBanID"       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- cũng là "Mã đặt bàn"
    "BanID"               INT          NOT NULL,
    "TenKhach"            VARCHAR(100) NOT NULL,
    "SoDienThoai"         VARCHAR(15)  NOT NULL,
    "SoNguoi"             INT          NOT NULL CONSTRAINT ck_phieudatban_songuoi CHECK ("SoNguoi" > 0),
    "ThoiGianDat"         TIMESTAMP    NOT NULL,
    "HinhThucDat"         VARCHAR(20)  NOT NULL
                          CONSTRAINT ck_phieudatban_hinhthuc CHECK ("HinhThucDat" IN ('TrucTiep','QuaDienThoai')),
    "GhiChu"              VARCHAR(500) NULL,
    "NhanVienTiepNhanID"  INT          NOT NULL,
    "TrangThai"           VARCHAR(20)  NOT NULL DEFAULT 'DaDat'
                          CONSTRAINT ck_phieudatban_trangthai CHECK ("TrangThai" IN ('DaDat','DaNhanBan','DaHuy')),
    "ThoiGianTao"         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ThoiGianNhanBan"     TIMESTAMP    NULL,
    "ThoiGianHuy"         TIMESTAMP    NULL,
    CONSTRAINT fk_phieudatban_ban  FOREIGN KEY ("BanID") REFERENCES "Ban"("BanID"),
    CONSTRAINT fk_phieudatban_user FOREIGN KEY ("NhanVienTiepNhanID") REFERENCES "User"("UserID")
);
CREATE INDEX ix_phieudatban_ban_thoigian ON "PhieuDatBan"("BanID", "ThoiGianDat");

/* ---- M5: Order + Bếp ---- */
CREATE TABLE "PhieuOrder" (
    "PhieuOrderID"      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- cũng là "Số phiếu order"
    "BanID"             INT          NOT NULL,
    "NhanVienPhucVuID"  INT          NOT NULL,
    "ThoiGianTao"       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TrangThai"         VARCHAR(20)  NOT NULL DEFAULT 'DangPhucVu'
                        CONSTRAINT ck_phieuorder_trangthai CHECK ("TrangThai" IN ('DangPhucVu','DaThanhToan','DaHuy')),
    "TongTamTinh"       NUMERIC(15,0) NOT NULL DEFAULT 0,
    CONSTRAINT fk_phieuorder_ban  FOREIGN KEY ("BanID") REFERENCES "Ban"("BanID"),
    CONSTRAINT fk_phieuorder_user FOREIGN KEY ("NhanVienPhucVuID") REFERENCES "User"("UserID")
);
CREATE INDEX ix_phieuorder_ban_trangthai ON "PhieuOrder"("BanID", "TrangThai");

CREATE TABLE "ChiTietOrder" (
    "PhieuOrderID"       INT          NOT NULL,
    "SoDong"             INT          NOT NULL,   -- STT dòng trong order (cho phép trùng món)
    "MonAnID"            INT          NOT NULL,
    "SoLuong"            INT          NOT NULL CONSTRAINT ck_chitietorder_soluong CHECK ("SoLuong" > 0),
    "DonGia"             NUMERIC(15,0) NOT NULL,  -- snapshot giá lúc gọi
    "ThanhTien"          NUMERIC(18,0) GENERATED ALWAYS AS ("SoLuong" * "DonGia") STORED,
    "GhiChu"             VARCHAR(200) NULL,
    "TrangThai"          VARCHAR(20)  NOT NULL DEFAULT 'ChuaChot'
                         CONSTRAINT ck_chitietorder_trangthai
                         CHECK ("TrangThai" IN ('ChuaChot','ChoCheBien','DangCheBien','DaXong','DaPhucVu','DaHuy')),
    "ThoiGianTao"        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ThoiGianChot"       TIMESTAMP    NULL,
    "ThoiGianXong"       TIMESTAMP    NULL,
    "ThoiGianPhucVu"     TIMESTAMP    NULL,
    "NhanVienXacNhanID"  INT          NULL,
    CONSTRAINT pk_chitietorder PRIMARY KEY ("PhieuOrderID", "SoDong"),
    CONSTRAINT fk_chitietorder_order FOREIGN KEY ("PhieuOrderID") REFERENCES "PhieuOrder"("PhieuOrderID") ON DELETE CASCADE,
    CONSTRAINT fk_chitietorder_mon   FOREIGN KEY ("MonAnID") REFERENCES "MonAn"("MonAnID"),
    CONSTRAINT fk_chitietorder_user  FOREIGN KEY ("NhanVienXacNhanID") REFERENCES "User"("UserID")
);
CREATE INDEX ix_chitietorder_trangthai_chot ON "ChiTietOrder"("TrangThai", "ThoiGianChot");  -- FIFO Bếp

/* ---- M6: Thanh toán ---- */
CREATE TABLE "HoaDon" (
    "HoaDonID"            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "MaHoaDon"            VARCHAR(20)  NOT NULL UNIQUE,    -- vd HD20260529-00001
    "PhieuOrderID"        INT          NOT NULL UNIQUE,    -- 1 order ↔ 1 hóa đơn
    "MaBanSnapshot"       VARCHAR(10)  NOT NULL,
    "NhanVienThuNganID"   INT          NOT NULL,
    "TongTienMon"         NUMERIC(15,0) NOT NULL,
    "TyLeVat"             NUMERIC(5,4) NOT NULL DEFAULT 0.1,   -- snapshot (0.1 = 10%)
    "TienVat"             NUMERIC(15,0) NOT NULL DEFAULT 0,
    "TongThanhToan"       NUMERIC(15,0) NOT NULL,
    "HinhThucTT"          VARCHAR(20)  NOT NULL
                          CONSTRAINT ck_hoadon_hinhthuc CHECK ("HinhThucTT" IN ('TienMat','ChuyenKhoan')),
    "TienKhachDua"        NUMERIC(15,0) NULL,
    "TienThua"            NUMERIC(15,0) NOT NULL DEFAULT 0,
    "MaGiaoDich"          VARCHAR(100) NULL,
    "ThoiGianTao"         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "SoLanIn"             INT          NOT NULL DEFAULT 0,  -- ≥2 → đóng dấu "BẢN SAO"
    CONSTRAINT fk_hoadon_order FOREIGN KEY ("PhieuOrderID") REFERENCES "PhieuOrder"("PhieuOrderID"),
    CONSTRAINT fk_hoadon_user  FOREIGN KEY ("NhanVienThuNganID") REFERENCES "User"("UserID")
);
CREATE INDEX ix_hoadon_thoigian ON "HoaDon"("ThoiGianTao" DESC);

CREATE TABLE "ChiTietHoaDon" (
    "HoaDonID"    INT           NOT NULL,
    "MonAnID"     INT           NOT NULL,
    "TenMon"      VARCHAR(100)  NOT NULL,   -- snapshot tên món
    "SoLuong"     INT           NOT NULL CONSTRAINT ck_chitiethoadon_soluong CHECK ("SoLuong" > 0),
    "DonGia"      NUMERIC(15,0) NOT NULL,   -- snapshot đơn giá
    "ThanhTien"   NUMERIC(18,0) GENERATED ALWAYS AS ("SoLuong" * "DonGia") STORED,
    CONSTRAINT pk_chitiethoadon PRIMARY KEY ("HoaDonID", "MonAnID"),
    CONSTRAINT fk_chitiethoadon_hoadon FOREIGN KEY ("HoaDonID") REFERENCES "HoaDon"("HoaDonID") ON DELETE CASCADE,
    CONSTRAINT fk_chitiethoadon_mon    FOREIGN KEY ("MonAnID") REFERENCES "MonAn"("MonAnID")
);

/* ---- M7: Kho ---- */
CREATE TABLE "NhaCungCap" (
    "NhaCungCapID"  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "TenNCC"        VARCHAR(150) NOT NULL UNIQUE,
    "SoDienThoai"   VARCHAR(15)  NULL,
    "DiaChi"        VARCHAR(300) NULL,
    "DangSuDung"    BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE "NguyenLieu" (
    "NguyenLieuID"        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "TenNVL"              VARCHAR(100)  NOT NULL UNIQUE,
    "DonViTinh"           VARCHAR(20)   NOT NULL,
    "TonHienTai"          NUMERIC(15,3) NOT NULL DEFAULT 0
                          CONSTRAINT ck_nguyenlieu_ton CHECK ("TonHienTai" >= 0),
    "DinhMucToiThieu"     NUMERIC(15,3) NOT NULL DEFAULT 0
                          CONSTRAINT ck_nguyenlieu_dinhmuc CHECK ("DinhMucToiThieu" >= 0),
    "ThoiGianCapNhatTon"  TIMESTAMP     NULL,
    "DangSuDung"          BOOLEAN       NOT NULL DEFAULT TRUE
);

CREATE TABLE "PhieuNhapKho" (
    "PhieuNhapKhoID"  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "MaPhieuNhap"     VARCHAR(20)   NOT NULL UNIQUE,   -- vd PN20260529-001
    "NhaCungCapID"    INT           NOT NULL,
    "NhanVienLapID"   INT           NOT NULL,
    "NgayNhap"        DATE          NOT NULL,
    "TongGiaTri"      NUMERIC(15,0) NOT NULL,
    "GhiChu"          VARCHAR(500)  NULL,
    "ThoiGianTao"     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_phieunhapkho_ncc  FOREIGN KEY ("NhaCungCapID") REFERENCES "NhaCungCap"("NhaCungCapID"),
    CONSTRAINT fk_phieunhapkho_user FOREIGN KEY ("NhanVienLapID") REFERENCES "User"("UserID")
);
CREATE INDEX ix_phieunhapkho_ngay ON "PhieuNhapKho"("NgayNhap");

CREATE TABLE "ChiTietNhapKho" (
    "PhieuNhapKhoID"  INT           NOT NULL,
    "NguyenLieuID"    INT           NOT NULL,
    "SoLuong"         NUMERIC(15,3) NOT NULL CONSTRAINT ck_chitietnhapkho_soluong CHECK ("SoLuong" > 0),
    "DonGia"          NUMERIC(15,0) NOT NULL CONSTRAINT ck_chitietnhapkho_dongia CHECK ("DonGia" > 0),
    "ThanhTien"       NUMERIC(18,3) GENERATED ALWAYS AS ("SoLuong" * "DonGia") STORED,
    "GhiChu"          VARCHAR(200)  NULL,
    CONSTRAINT pk_chitietnhapkho PRIMARY KEY ("PhieuNhapKhoID", "NguyenLieuID"),
    CONSTRAINT fk_chitietnhapkho_phieu FOREIGN KEY ("PhieuNhapKhoID") REFERENCES "PhieuNhapKho"("PhieuNhapKhoID") ON DELETE CASCADE,
    CONSTRAINT fk_chitietnhapkho_nvl   FOREIGN KEY ("NguyenLieuID") REFERENCES "NguyenLieu"("NguyenLieuID")
);

CREATE TABLE "PhieuXuatKho" (
    "PhieuXuatKhoID"  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "MaPhieuXuat"     VARCHAR(20)   NOT NULL UNIQUE,   -- vd PX20260529-001
    "NhanVienLapID"   INT           NOT NULL,
    "NgayXuat"        DATE          NOT NULL,
    "TongGiaTri"      NUMERIC(15,0) NOT NULL,
    "GhiChu"          VARCHAR(500)  NULL,
    "ThoiGianTao"     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_phieuxuatkho_user FOREIGN KEY ("NhanVienLapID") REFERENCES "User"("UserID")
);
CREATE INDEX ix_phieuxuatkho_ngay ON "PhieuXuatKho"("NgayXuat");

CREATE TABLE "ChiTietXuatKho" (
    "PhieuXuatKhoID"  INT           NOT NULL,
    "NguyenLieuID"    INT           NOT NULL,
    "SoLuong"         NUMERIC(15,3) NOT NULL CONSTRAINT ck_chitietxuatkho_soluong CHECK ("SoLuong" > 0),
    "DonGia"          NUMERIC(15,0) NOT NULL CONSTRAINT ck_chitietxuatkho_dongia CHECK ("DonGia" > 0),
    "ThanhTien"       NUMERIC(18,3) GENERATED ALWAYS AS ("SoLuong" * "DonGia") STORED,
    "GhiChu"          VARCHAR(200)  NULL,
    CONSTRAINT pk_chitietxuatkho PRIMARY KEY ("PhieuXuatKhoID", "NguyenLieuID"),
    CONSTRAINT fk_chitietxuatkho_phieu FOREIGN KEY ("PhieuXuatKhoID") REFERENCES "PhieuXuatKho"("PhieuXuatKhoID") ON DELETE CASCADE,
    CONSTRAINT fk_chitietxuatkho_nvl   FOREIGN KEY ("NguyenLieuID") REFERENCES "NguyenLieu"("NguyenLieuID")
);

/* =====================================================================
   3. DỮ LIỆU SEED
   ===================================================================== */

/* ---- 3.1 Role (cố định 5 vai trò) ---- */
INSERT INTO "Role" ("RoleID", "RoleName", "Description") VALUES
('Admin',   'Quản lý',     'Quản lý toàn hệ thống'),
('PhucVu',  'Phục vụ',     'Tiếp nhận đặt bàn, gọi món, phục vụ'),
('Bep',     'Bộ phận Bếp', 'Chế biến món ăn'),
('ThuNgan', 'Thu ngân',    'Thanh toán, xuất hóa đơn'),
('Kho',     'Bộ phận Kho', 'Nhập / xuất / báo cáo kho');

/* ---- 3.2 User (mật khẩu mặc định = 'matkhau123', bcrypt cost 10) ---- */
INSERT INTO "User" ("Username", "PasswordHash", "FullName", "RoleID") VALUES
('admin',    '$2b$10$Q5FYsgeTUqvY3uPMY3z3..mw4HP/pkExIXGioclvgGP.F9ILwu8S6', 'Quản trị viên', 'Admin'),
('phucvu1',  '$2b$10$bi3K41CbCwRLHlZ2Dx/qL.OCMSadwWzwdNoWPmX1ziXyzkPFm7tfm', 'Nguyễn Văn A',   'PhucVu'),
('bep1',     '$2b$10$DgCzQwdMvdGkf8.afjLBRuHo1NzyRx1nLdwBrL4leADXuBR5bnSZG', 'Trần Thị B',     'Bep'),
('thungan1', '$2b$10$Wt3dMdDuiHaq8PjW8j0.jeQrKn0inwnWMVf0lsxFnbTG6AzhA25oW', 'Lê Văn C',       'ThuNgan'),
('kho1',     '$2b$10$6GJG7aWBUXE/RQxlfNSIPOF/GwjSeGYWGaL3GujwIEvMa3jxhRkoG', 'Phạm Thị D',     'Kho');

/* ---- 3.3 Ban ---- (2 tầng, T1 17 bàn, T2 18 bàn, sức chứa 4) */
INSERT INTO "Ban" ("MaBan", "KhuVuc", "SucChua") VALUES
-- Tầng 1: 17 bàn
('B101', 'Tầng 1', 4), ('B102', 'Tầng 1', 4), ('B103', 'Tầng 1', 4), ('B104', 'Tầng 1', 4),
('B105', 'Tầng 1', 4), ('B106', 'Tầng 1', 4), ('B107', 'Tầng 1', 4), ('B108', 'Tầng 1', 4),
('B109', 'Tầng 1', 4), ('B110', 'Tầng 1', 4), ('B111', 'Tầng 1', 4), ('B112', 'Tầng 1', 4),
('B113', 'Tầng 1', 4), ('B114', 'Tầng 1', 4), ('B115', 'Tầng 1', 4), ('B116', 'Tầng 1', 4),
('B117', 'Tầng 1', 4),
-- Tầng 2: 18 bàn
('B201', 'Tầng 2', 4), ('B202', 'Tầng 2', 4), ('B203', 'Tầng 2', 4), ('B204', 'Tầng 2', 4),
('B205', 'Tầng 2', 4), ('B206', 'Tầng 2', 4), ('B207', 'Tầng 2', 4), ('B208', 'Tầng 2', 4),
('B209', 'Tầng 2', 4), ('B210', 'Tầng 2', 4), ('B211', 'Tầng 2', 4), ('B212', 'Tầng 2', 4),
('B213', 'Tầng 2', 4), ('B214', 'Tầng 2', 4), ('B215', 'Tầng 2', 4), ('B216', 'Tầng 2', 4),
('B217', 'Tầng 2', 4), ('B218', 'Tầng 2', 4);

/* ---- 3.4 MonAn ---- */
INSERT INTO "MonAn" ("MaSanPham", "TenMon", "LoaiMon", "DonGia") VALUES
-- Món ăn (→ Bếp)
('SP000221', 'NÉ MC',                    'MonAn',  95000),
('SP000205', 'BÍT TẾT MC',               'MonAn', 140000),
('SP000251', 'CƠM BLL',                  'MonAn', 160000),
('SP000211', 'BÍT TẾT ĐẶC BIỆT',         'MonAn', 228000),
('SP000230', 'NÉ SỐT PATE',              'MonAn', 100000),
('SP000237', 'NÉ TRỨNG',                 'MonAn',  93000),
('SP000219', 'BÍT TẾT + TRỨNG',          'MonAn', 155000),
('SP000231', 'NÉ + PATE',                'MonAn', 119000),
('SP000269', 'MÌ Ý',                     'MonAn', 105000),
('SP000229', 'NÉ SỐT PATE KHÔNG TRỨNG',  'MonAn',  98000),
('SP000290', 'BÒ KHO',                   'MonAn',  95000),
('SP000391', 'NÉ NHỎ + X.XÍCH',          'MonAn',  94000),
('SP000234', 'NÉ KHÔNG XÍU MẠI',         'MonAn',  90000),
('SP000297', 'PHỞ MC',                   'MonAn',  65000),
('SP000303', 'KHOAI TÂY',                'MonAn',  45000),
('SP000352', 'BÁNH MÌ',                  'MonAn',   6000),
('SP000353', 'TRỨNG',                    'MonAn',  15000),
-- Đồ uống (phục vụ trực tiếp, không qua Bếp)
('SP000324', 'RAU MÁ',                   'DoUong',  20000),
('SP000325', 'ĐẬU NÀNH',                 'DoUong',  20000),
('SP000337', 'CAM LON',                  'DoUong',  17000),
('SP000335', 'KHOÁNG LẠT',               'DoUong',  17000),
('SP000330', 'SUỐI',                     'DoUong',  11000),
('SP000342', 'TRÀ ĐÁ',                   'DoUong',   3000);

/* ---- 3.5 NhaCungCap & NguyenLieu (NVL tiêu biểu cho M7 demo) ---- */
INSERT INTO "NhaCungCap" ("TenNCC", "SoDienThoai", "DiaChi") VALUES
('Cơ sở cung cấp thịt bò',    '0901234567', 'TP.HCM'),
('Đại lý thực phẩm - đồ khô', '0907654321', 'TP.HCM');

INSERT INTO "NguyenLieu" ("TenNVL", "DonViTinh", "TonHienTai", "DinhMucToiThieu") VALUES
('Miếng bò né',      'kg',    30.0,  5.0),
('Miếng bò bít tết', 'kg',    25.0,  5.0),
('Pa tê',            'kg',    10.0,  2.0),
('Xíu mại',          'phần', 100.0, 20.0),
('Xúc xích',         'kg',     8.0,  2.0),
('Bò kho',           'kg',    12.0,  3.0),
('Trứng',            'quả',  200.0, 30.0),
('Bánh mì',          'ổ',    100.0, 20.0),
('Bánh phở',         'kg',    10.0,  2.0),
('Khoai tây',        'kg',    15.0,  3.0),
('Cà chua',          'kg',    10.0,  2.0),
('Hành phi',         'kg',     3.0,  0.5);
