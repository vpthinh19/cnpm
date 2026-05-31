/* =====================================================================
   HỆ THỐNG QUẢN LÝ NHÀ HÀNG BÒ NÉ MỸ CẢNH
   Script khởi tạo CSDL — Microsoft SQL Server 2019+
   Sinh theo DESIGN.md §2 (15 bảng, 8 module). Quy ước: PK <Bảng>ID INT
   IDENTITY; mã nghiệp vụ Ma<...> VARCHAR; bảng ChiTiet* dùng PK ghép.
   Thực thể hệ thống (Role/User) đặt tên tiếng Anh; User là từ khóa → [User].

   Cách dùng: mở bằng SSMS / sqlcmd, đặt đúng database rồi chạy toàn bộ.
   Mật khẩu seed mặc định cho mọi tài khoản = 'matkhau123' (bcrypt cost 10).
   ===================================================================== */

-- (Tùy chọn) tạo & chọn database. Bỏ comment nếu muốn script tự tạo DB.
-- IF DB_ID('BoNeMyCanh') IS NULL CREATE DATABASE BoNeMyCanh;
-- GO
-- USE BoNeMyCanh;
-- GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

/* ---------------------------------------------------------------------
   1. XÓA BẢNG CŨ (nếu chạy lại) — theo thứ tự phụ thuộc ngược
   --------------------------------------------------------------------- */
DROP TABLE IF EXISTS ChiTietXuatKho;
DROP TABLE IF EXISTS PhieuXuatKho;
DROP TABLE IF EXISTS ChiTietNhapKho;
DROP TABLE IF EXISTS PhieuNhapKho;
DROP TABLE IF EXISTS ChiTietHoaDon;
DROP TABLE IF EXISTS HoaDon;
DROP TABLE IF EXISTS ChiTietOrder;
DROP TABLE IF EXISTS PhieuOrder;
DROP TABLE IF EXISTS PhieuDatBan;
DROP TABLE IF EXISTS NguyenLieu;
DROP TABLE IF EXISTS NhaCungCap;
DROP TABLE IF EXISTS MonAn;
DROP TABLE IF EXISTS Ban;
DROP TABLE IF EXISTS [User];
DROP TABLE IF EXISTS Role;
GO

/* =====================================================================
   2. TẠO BẢNG
   ===================================================================== */

/* ---- M1: Xác thực + Tài khoản ---- */
CREATE TABLE Role (
    RoleID       VARCHAR(10)   NOT NULL PRIMARY KEY,   -- Admin/PhucVu/Bep/ThuNgan/Kho
    RoleName     NVARCHAR(50)  NOT NULL,
    Description  NVARCHAR(200) NULL
);
GO

CREATE TABLE [User] (
    UserID            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Username          VARCHAR(50)  NOT NULL UNIQUE,
    PasswordHash      VARCHAR(255) NOT NULL,
    FullName          NVARCHAR(100) NOT NULL,
    RoleID            VARCHAR(10)  NOT NULL,
    Status            VARCHAR(20)  NOT NULL DEFAULT 'HoatDong'
                      CONSTRAINT CK_User_Status CHECK (Status IN ('HoatDong','DaKhoa')),
    FailedLoginCount  TINYINT      NOT NULL DEFAULT 0,
    LastLoginAt       DATETIME2    NULL,
    CreatedAt         DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt         DATETIME2    NULL,
    CONSTRAINT FK_User_Role FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);
GO
CREATE INDEX IX_User_Role ON [User](RoleID);
GO

/* ---- M2: Quản lý bàn ---- */
CREATE TABLE Ban (
    BanID       INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    MaBan       VARCHAR(10)  NOT NULL UNIQUE,
    KhuVuc      NVARCHAR(50) NOT NULL,
    SucChua     INT          NOT NULL CONSTRAINT CK_Ban_SucChua CHECK (SucChua > 0),
    TrangThai   VARCHAR(20)  NOT NULL DEFAULT 'Trong'
                CONSTRAINT CK_Ban_TrangThai CHECK (TrangThai IN ('Trong','DaDat','CoKhach')),
    GhiChu      NVARCHAR(200) NULL,
    DangSuDung  BIT          NOT NULL DEFAULT 1
);
GO

/* ---- M3: Thực đơn ---- */
CREATE TABLE MonAn (
    MonAnID     INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    MaSanPham   VARCHAR(20)   NOT NULL UNIQUE,   -- mã theo sổ sách (vd SP000221)
    TenMon      NVARCHAR(100) NOT NULL UNIQUE,
    LoaiMon     VARCHAR(10)   NOT NULL
                CONSTRAINT CK_MonAn_LoaiMon CHECK (LoaiMon IN ('MonAn','DoUong')),
    DonGia      DECIMAL(15,0) NOT NULL CONSTRAINT CK_MonAn_DonGia CHECK (DonGia >= 0),
    TrangThai   VARCHAR(10)   NOT NULL DEFAULT 'ConHang'
                CONSTRAINT CK_MonAn_TrangThai CHECK (TrangThai IN ('ConHang','HetHang')),
    MoTa        NVARCHAR(500) NULL,
    DangSuDung  BIT           NOT NULL DEFAULT 1
);
GO

/* ---- M4: Đặt bàn ---- */
CREATE TABLE PhieuDatBan (
    PhieuDatBanID       INT IDENTITY(1,1) NOT NULL PRIMARY KEY,  -- cũng là "Mã đặt bàn"
    BanID               INT          NOT NULL,
    TenKhach            NVARCHAR(100) NOT NULL,
    SoDienThoai         VARCHAR(15)  NOT NULL,
    SoNguoi             INT          NOT NULL CONSTRAINT CK_PhieuDatBan_SoNguoi CHECK (SoNguoi > 0),
    ThoiGianDat         DATETIME2    NOT NULL,
    HinhThucDat         VARCHAR(20)  NOT NULL
                        CONSTRAINT CK_PhieuDatBan_HinhThuc CHECK (HinhThucDat IN ('TrucTiep','QuaDienThoai')),
    GhiChu              NVARCHAR(500) NULL,
    NhanVienTiepNhanID  INT          NOT NULL,
    TrangThai           VARCHAR(20)  NOT NULL DEFAULT 'DaDat'
                        CONSTRAINT CK_PhieuDatBan_TrangThai CHECK (TrangThai IN ('DaDat','DaNhanBan','DaHuy')),
    ThoiGianTao         DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    ThoiGianNhanBan     DATETIME2    NULL,
    ThoiGianHuy         DATETIME2    NULL,
    CONSTRAINT FK_PhieuDatBan_Ban  FOREIGN KEY (BanID) REFERENCES Ban(BanID),
    CONSTRAINT FK_PhieuDatBan_User FOREIGN KEY (NhanVienTiepNhanID) REFERENCES [User](UserID)
);
GO
CREATE INDEX IX_PhieuDatBan_Ban_ThoiGian ON PhieuDatBan(BanID, ThoiGianDat);
GO

/* ---- M5: Order + Bếp ---- */
CREATE TABLE PhieuOrder (
    PhieuOrderID      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,  -- cũng là "Số phiếu order"
    BanID             INT          NOT NULL,
    NhanVienPhucVuID  INT          NOT NULL,
    ThoiGianTao       DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    TrangThai         VARCHAR(20)  NOT NULL DEFAULT 'DangPhucVu'
                      CONSTRAINT CK_PhieuOrder_TrangThai CHECK (TrangThai IN ('DangPhucVu','DaThanhToan','DaHuy')),
    TongTamTinh       DECIMAL(15,0) NOT NULL DEFAULT 0,
    CONSTRAINT FK_PhieuOrder_Ban  FOREIGN KEY (BanID) REFERENCES Ban(BanID),
    CONSTRAINT FK_PhieuOrder_User FOREIGN KEY (NhanVienPhucVuID) REFERENCES [User](UserID)
);
GO
CREATE INDEX IX_PhieuOrder_Ban_TrangThai ON PhieuOrder(BanID, TrangThai);
GO

CREATE TABLE ChiTietOrder (
    PhieuOrderID       INT          NOT NULL,
    SoDong             INT          NOT NULL,   -- STT dòng trong order (cho phép trùng món)
    MonAnID            INT          NOT NULL,
    SoLuong            INT          NOT NULL CONSTRAINT CK_ChiTietOrder_SoLuong CHECK (SoLuong > 0),
    DonGia             DECIMAL(15,0) NOT NULL,  -- snapshot giá lúc gọi
    ThanhTien          AS (SoLuong * DonGia) PERSISTED,
    GhiChu             NVARCHAR(200) NULL,
    TrangThai          VARCHAR(20)  NOT NULL DEFAULT 'ChuaChot'
                       CONSTRAINT CK_ChiTietOrder_TrangThai
                       CHECK (TrangThai IN ('ChuaChot','ChoCheBien','DangCheBien','DaXong','DaPhucVu','DaHuy')),
    ThoiGianTao        DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    ThoiGianChot       DATETIME2    NULL,
    ThoiGianXong       DATETIME2    NULL,
    ThoiGianPhucVu     DATETIME2    NULL,
    NhanVienXacNhanID  INT          NULL,
    CONSTRAINT PK_ChiTietOrder PRIMARY KEY (PhieuOrderID, SoDong),
    CONSTRAINT FK_ChiTietOrder_Order FOREIGN KEY (PhieuOrderID) REFERENCES PhieuOrder(PhieuOrderID) ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietOrder_Mon   FOREIGN KEY (MonAnID) REFERENCES MonAn(MonAnID),
    CONSTRAINT FK_ChiTietOrder_User  FOREIGN KEY (NhanVienXacNhanID) REFERENCES [User](UserID)
);
GO
CREATE INDEX IX_ChiTietOrder_TrangThai_Chot ON ChiTietOrder(TrangThai, ThoiGianChot);  -- FIFO Bếp
GO

/* ---- M6: Thanh toán ---- */
CREATE TABLE HoaDon (
    HoaDonID            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    MaHoaDon            VARCHAR(20)  NOT NULL UNIQUE,    -- vd HD20260529-00001
    PhieuOrderID        INT          NOT NULL UNIQUE,   -- 1 order ↔ 1 hóa đơn
    MaBanSnapshot       VARCHAR(10)  NOT NULL,
    NhanVienThuNganID   INT          NOT NULL,
    TongTienMon         DECIMAL(15,0) NOT NULL,
    TyLeVat             DECIMAL(5,4) NOT NULL DEFAULT 0.1,   -- snapshot (0.1 = 10%)
    TienVat             DECIMAL(15,0) NOT NULL DEFAULT 0,
    TongThanhToan       DECIMAL(15,0) NOT NULL,
    HinhThucTT          VARCHAR(20)  NOT NULL
                        CONSTRAINT CK_HoaDon_HinhThuc CHECK (HinhThucTT IN ('TienMat','ChuyenKhoan')),
    TienKhachDua        DECIMAL(15,0) NULL,
    TienThua            DECIMAL(15,0) NOT NULL DEFAULT 0,
    MaGiaoDich          VARCHAR(100) NULL,
    ThoiGianTao         DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    SoLanIn             INT          NOT NULL DEFAULT 0,  -- ≥2 → đóng dấu "BẢN SAO"
    CONSTRAINT FK_HoaDon_Order FOREIGN KEY (PhieuOrderID) REFERENCES PhieuOrder(PhieuOrderID),
    CONSTRAINT FK_HoaDon_User  FOREIGN KEY (NhanVienThuNganID) REFERENCES [User](UserID)
);
GO
CREATE INDEX IX_HoaDon_ThoiGian ON HoaDon(ThoiGianTao DESC);
GO

CREATE TABLE ChiTietHoaDon (
    HoaDonID    INT           NOT NULL,
    MonAnID     INT           NOT NULL,
    TenMon      NVARCHAR(100) NOT NULL,   -- snapshot tên món
    SoLuong     INT           NOT NULL CONSTRAINT CK_ChiTietHoaDon_SoLuong CHECK (SoLuong > 0),
    DonGia      DECIMAL(15,0) NOT NULL,   -- snapshot đơn giá
    ThanhTien   AS (SoLuong * DonGia) PERSISTED,
    CONSTRAINT PK_ChiTietHoaDon PRIMARY KEY (HoaDonID, MonAnID),
    CONSTRAINT FK_ChiTietHoaDon_HoaDon FOREIGN KEY (HoaDonID) REFERENCES HoaDon(HoaDonID) ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietHoaDon_Mon    FOREIGN KEY (MonAnID) REFERENCES MonAn(MonAnID)
);
GO

/* ---- M7: Kho ---- */
CREATE TABLE NhaCungCap (
    NhaCungCapID  INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TenNCC        NVARCHAR(150) NOT NULL UNIQUE,
    SoDienThoai   VARCHAR(15)   NULL,
    DiaChi        NVARCHAR(300) NULL,
    DangSuDung    BIT           NOT NULL DEFAULT 1
);
GO

CREATE TABLE NguyenLieu (
    NguyenLieuID        INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TenNVL              NVARCHAR(100) NOT NULL UNIQUE,
    DonViTinh           NVARCHAR(20)  NOT NULL,
    TonHienTai          DECIMAL(15,3) NOT NULL DEFAULT 0
                        CONSTRAINT CK_NguyenLieu_Ton CHECK (TonHienTai >= 0),
    DinhMucToiThieu     DECIMAL(15,3) NOT NULL DEFAULT 0
                        CONSTRAINT CK_NguyenLieu_DinhMuc CHECK (DinhMucToiThieu >= 0),
    ThoiGianCapNhatTon  DATETIME2     NULL,
    DangSuDung          BIT           NOT NULL DEFAULT 1
);
GO

CREATE TABLE PhieuNhapKho (
    PhieuNhapKhoID  INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    MaPhieuNhap     VARCHAR(20)   NOT NULL UNIQUE,   -- vd PN20260529-001
    NhaCungCapID    INT           NOT NULL,
    NhanVienLapID   INT           NOT NULL,
    NgayNhap        DATE          NOT NULL,
    TongGiaTri      DECIMAL(15,0) NOT NULL,
    GhiChu          NVARCHAR(500) NULL,
    ThoiGianTao     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PhieuNhapKho_NCC  FOREIGN KEY (NhaCungCapID) REFERENCES NhaCungCap(NhaCungCapID),
    CONSTRAINT FK_PhieuNhapKho_User FOREIGN KEY (NhanVienLapID) REFERENCES [User](UserID)
);
GO
CREATE INDEX IX_PhieuNhapKho_Ngay ON PhieuNhapKho(NgayNhap);
GO

CREATE TABLE ChiTietNhapKho (
    PhieuNhapKhoID  INT           NOT NULL,
    NguyenLieuID    INT           NOT NULL,
    SoLuong         DECIMAL(15,3) NOT NULL CONSTRAINT CK_ChiTietNhapKho_SoLuong CHECK (SoLuong > 0),
    DonGia          DECIMAL(15,0) NOT NULL CONSTRAINT CK_ChiTietNhapKho_DonGia CHECK (DonGia > 0),
    ThanhTien       AS (SoLuong * DonGia) PERSISTED,
    GhiChu          NVARCHAR(200) NULL,
    CONSTRAINT PK_ChiTietNhapKho PRIMARY KEY (PhieuNhapKhoID, NguyenLieuID),
    CONSTRAINT FK_ChiTietNhapKho_Phieu FOREIGN KEY (PhieuNhapKhoID) REFERENCES PhieuNhapKho(PhieuNhapKhoID) ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietNhapKho_NVL   FOREIGN KEY (NguyenLieuID) REFERENCES NguyenLieu(NguyenLieuID)
);
GO

CREATE TABLE PhieuXuatKho (
    PhieuXuatKhoID  INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    MaPhieuXuat     VARCHAR(20)   NOT NULL UNIQUE,   -- vd PX20260529-001
    NhanVienLapID   INT           NOT NULL,
    NgayXuat        DATE          NOT NULL,
    TongGiaTri      DECIMAL(15,0) NOT NULL,
    GhiChu          NVARCHAR(500) NULL,
    ThoiGianTao     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PhieuXuatKho_User FOREIGN KEY (NhanVienLapID) REFERENCES [User](UserID)
);
GO
CREATE INDEX IX_PhieuXuatKho_Ngay ON PhieuXuatKho(NgayXuat);
GO

CREATE TABLE ChiTietXuatKho (
    PhieuXuatKhoID  INT           NOT NULL,
    NguyenLieuID    INT           NOT NULL,
    SoLuong         DECIMAL(15,3) NOT NULL CONSTRAINT CK_ChiTietXuatKho_SoLuong CHECK (SoLuong > 0),
    DonGia          DECIMAL(15,0) NOT NULL CONSTRAINT CK_ChiTietXuatKho_DonGia CHECK (DonGia > 0),
    ThanhTien       AS (SoLuong * DonGia) PERSISTED,
    GhiChu          NVARCHAR(200) NULL,
    CONSTRAINT PK_ChiTietXuatKho PRIMARY KEY (PhieuXuatKhoID, NguyenLieuID),
    CONSTRAINT FK_ChiTietXuatKho_Phieu FOREIGN KEY (PhieuXuatKhoID) REFERENCES PhieuXuatKho(PhieuXuatKhoID) ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietXuatKho_NVL   FOREIGN KEY (NguyenLieuID) REFERENCES NguyenLieu(NguyenLieuID)
);
GO

/* =====================================================================
   3. DỮ LIỆU SEED
   ===================================================================== */

/* ---- 3.1 Role (cố định 5 vai trò) ---- */
INSERT INTO Role (RoleID, RoleName, Description) VALUES
('Admin',   N'Quản lý',     N'Quản lý toàn hệ thống'),
('PhucVu',  N'Phục vụ',     N'Tiếp nhận đặt bàn, gọi món, phục vụ'),
('Bep',     N'Bộ phận Bếp', N'Chế biến món ăn'),
('ThuNgan', N'Thu ngân',    N'Thanh toán, xuất hóa đơn'),
('Kho',     N'Bộ phận Kho', N'Nhập / xuất / báo cáo kho');
GO

/* ---- 3.2 User (mật khẩu mặc định = 'matkhau123', bcrypt cost 10) ---- */
INSERT INTO [User] (Username, PasswordHash, FullName, RoleID) VALUES
('admin',    '$2b$10$Q5FYsgeTUqvY3uPMY3z3..mw4HP/pkExIXGioclvgGP.F9ILwu8S6', N'Quản trị viên', 'Admin'),
('phucvu1',  '$2b$10$bi3K41CbCwRLHlZ2Dx/qL.OCMSadwWzwdNoWPmX1ziXyzkPFm7tfm', N'Nguyễn Văn A',   'PhucVu'),
('bep1',     '$2b$10$DgCzQwdMvdGkf8.afjLBRuHo1NzyRx1nLdwBrL4leADXuBR5bnSZG', N'Trần Thị B',     'Bep'),
('thungan1', '$2b$10$Wt3dMdDuiHaq8PjW8j0.jeQrKn0inwnWMVf0lsxFnbTG6AzhA25oW', N'Lê Văn C',       'ThuNgan'),
('kho1',     '$2b$10$6GJG7aWBUXE/RQxlfNSIPOF/GwjSeGYWGaL3GujwIEvMa3jxhRkoG', N'Phạm Thị D',     'Kho');
GO

/* ---- 3.3 Ban ---- */
INSERT INTO Ban (MaBan, KhuVuc, SucChua) VALUES
('B01',   N'Tầng 1',     4),
('B02',   N'Tầng 1',     6),
('B03',   N'Tầng 2',     4),
('B04',   N'Tầng 2',     6),
('SV01',  N'Sân vườn',   8),
('VIP01', N'Phòng VIP', 10);
GO

/* ---- 3.4 MonAn — menu thật của Bò Né Mỹ Cảnh (23 món) ---- */
INSERT INTO MonAn (MaSanPham, TenMon, LoaiMon, DonGia) VALUES
-- Món ăn (→ Bếp)
('SP000221', N'NÉ MC',                    'MonAn',  95000),
('SP000205', N'BÍT TẾT MC',               'MonAn', 140000),
('SP000251', N'CƠM BLL',                  'MonAn', 160000),
('SP000211', N'BÍT TẾT ĐẶC BIỆT',         'MonAn', 228000),
('SP000230', N'NÉ SỐT PATE',              'MonAn', 100000),
('SP000237', N'NÉ TRỨNG',                 'MonAn',  93000),
('SP000219', N'BÍT TẾT + TRỨNG',          'MonAn', 155000),
('SP000231', N'NÉ + PATE',                'MonAn', 119000),
('SP000269', N'MÌ Ý',                     'MonAn', 105000),
('SP000229', N'NÉ SỐT PATE KHÔNG TRỨNG',  'MonAn',  98000),
('SP000290', N'BÒ KHO',                   'MonAn',  95000),
('SP000391', N'NÉ NHỎ + X.XÍCH',          'MonAn',  94000),
('SP000234', N'NÉ KHÔNG XÍU MẠI',         'MonAn',  90000),
('SP000297', N'PHỞ MC',                   'MonAn',  65000),
('SP000303', N'KHOAI TÂY',                'MonAn',  45000),
('SP000352', N'BÁNH MÌ',                  'MonAn',   6000),
('SP000353', N'TRỨNG',                    'MonAn',  15000),
-- Đồ uống (phục vụ trực tiếp, không qua Bếp)
('SP000324', N'RAU MÁ',                   'DoUong',  20000),
('SP000325', N'ĐẬU NÀNH',                 'DoUong',  20000),
('SP000337', N'CAM LON',                  'DoUong',  17000),
('SP000335', N'KHOÁNG LẠT',               'DoUong',  17000),
('SP000330', N'SUỐI',                     'DoUong',  11000),
('SP000342', N'TRÀ ĐÁ',                   'DoUong',   3000);
GO

/* ---- 3.5 NhaCungCap & NguyenLieu (NVL tiêu biểu cho M7 demo) ---- */
INSERT INTO NhaCungCap (TenNCC, SoDienThoai, DiaChi) VALUES
(N'Cơ sở cung cấp thịt bò',    N'0901234567', N'TP.HCM'),
(N'Đại lý thực phẩm - đồ khô', N'0907654321', N'TP.HCM');
GO

INSERT INTO NguyenLieu (TenNVL, DonViTinh, TonHienTai, DinhMucToiThieu) VALUES
(N'Miếng bò né',      N'kg',    30.0,  5.0),
(N'Miếng bò bít tết', N'kg',    25.0,  5.0),
(N'Pa tê',            N'kg',    10.0,  2.0),
(N'Xíu mại',          N'phần', 100.0, 20.0),
(N'Xúc xích',         N'kg',     8.0,  2.0),
(N'Bò kho',           N'kg',    12.0,  3.0),
(N'Trứng',            N'quả',  200.0, 30.0),
(N'Bánh mì',          N'ổ',    100.0, 20.0),
(N'Bánh phở',         N'kg',    10.0,  2.0),
(N'Khoai tây',        N'kg',    15.0,  3.0),
(N'Cà chua',          N'kg',    10.0,  2.0),
(N'Hành phi',         N'kg',     3.0,  0.5);
GO

PRINT N'>> Khởi tạo CSDL Bò Né Mỹ Cảnh hoàn tất: 15 bảng + seed (5 tài khoản, 6 bàn, 23 món, 2 NCC, 12 NVL).';
GO
