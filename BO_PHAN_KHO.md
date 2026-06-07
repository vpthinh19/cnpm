# BỘ PHẬN KHO (Module M7) — Tài liệu ôn vấn đáp

> Tổng hợp toàn bộ thông tin phần **Kho** của đồ án Quản lý nhà hàng.
> Stack: Node.js/Express + PostgreSQL + HTML/CSS/JS thuần.
> Nguồn: `DESCRIPTION.md`, `DESIGN.md`, `database.sql`, `src/modules/kho/*`.

---

## 1. Tổng quan vai trò

- **Bộ phận Kho** là 1 trong 5 vai trò của hệ thống: `Admin / PhucVu / Bep / ThuNgan / Kho`.
- Nhiệm vụ: lập **phiếu nhập / phiếu xuất** kho (có số lượng + đơn giá), hệ thống tự **cập nhật tồn kho** và lưu phiếu vào CSDL; làm **báo cáo tồn / nhập / xuất**.
- Trong kiến trúc 8 module độc lập, đây là **Module M7 — Kho**.
- Bảng sử dụng (R/W): `NhaCungCap`, `NguyenLieu`, `PhieuNhapKho` + `ChiTietNhapKho`, `PhieuXuatKho` + `ChiTietXuatKho`.
- Base API: `/kho/*`. Không phụ thuộc module khác (coupling thấp).

### Phân quyền truy cập
| Thao tác | Vai trò được phép |
|---|---|
| Ghi (tạo/sửa/xóa NCC, NVL; lập phiếu nhập/xuất) | **Kho** |
| Đọc danh sách & xem báo cáo (tồn/nhập/xuất) | **Kho** + **Admin** |

> Admin chỉ **xem báo cáo**, không lập phiếu. Mọi API đều qua middleware `authenticate` (JWT) rồi `authorize`.

---

## 2. Các chức năng nghiệp vụ (biểu mẫu K_BM)

| Mã | Chức năng | Loại | Quy định / Công thức | Biểu mẫu |
|---|---|---|---|---|
| K_BM1 | Lập phiếu nhập kho | Lưu trữ | K_QĐ1. Tổng giá trị nhập = ∑(SL × Đơn giá) | `kho-nhap.html` |
| K_BM2 | Lập phiếu xuất kho | Lưu trữ | K_QĐ1. **Không xuất quá tồn**. Tổng giá trị xuất = ∑(SL × Đơn giá) | `kho-xuat.html` |
| K_BM3 | Báo cáo tồn kho | Kết xuất | **Tồn cuối = Tồn đầu + Nhập − Xuất** | `kho-bc-ton.html` |
| K_BM4 | Báo cáo nhập kho | Kết xuất | Thống kê tổng NVL đã nhập trong kỳ | `kho-bc-nhap.html` |
| K_BM5 | Báo cáo xuất kho | Kết xuất | Thống kê tổng NVL đã xuất trong kỳ | `kho-bc-xuat.html` |

Hai loại nghiệp vụ:
- **Lưu trữ**: ghi dữ liệu mới vào CSDL (lập phiếu nhập/xuất).
- **Kết xuất**: chỉ đọc, tổng hợp số liệu để báo cáo.

---

## 3. Quy định nghiệp vụ K_QĐ1 (rất hay bị hỏi)

**Quy định nhập/xuất kho:**
- **Phiếu nhập:** NVL phải có trong danh mục; `SoLuong > 0`; `DonGia > 0`; **phải gán nhà cung cấp**.
- **Phiếu xuất:** `SoLuong xuất ≤ TonHienTai` (tồn kho hiện tại).
- **Tồn kho cập nhật tức thời** sau khi lưu phiếu: **Tồn mới = Tồn cũ + Nhập − Xuất**.
- **Cảnh báo** khi `TonHienTai ≤ DinhMucToiThieu` (định mức cấu hình theo từng NVL).
- Phiếu đã lưu **không sửa/không xóa** — muốn điều chỉnh phải lập phiếu mới (nên không có API PUT/DELETE trên phiếu nhập/xuất).

---

## 4. Mô hình dữ liệu (6 bảng — bảng 10→15 trong tổng số 15 bảng)

### 4.1. `NhaCungCap` (NCC)
| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `NhaCungCapID` | INT IDENTITY | **PK** |
| `TenNCC` | VARCHAR(150) | UNIQUE, NOT NULL |
| `SoDienThoai` | VARCHAR(15) | NULL |
| `DiaChi` | VARCHAR(300) | NULL |
| `DangSuDung` | BOOLEAN | NOT NULL, DEFAULT TRUE (**xóa mềm**) |

### 4.2. `NguyenLieu` (NVL) — danh mục + tồn kho real-time
| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `NguyenLieuID` | INT IDENTITY | **PK** |
| `TenNVL` | VARCHAR(100) | UNIQUE, NOT NULL |
| `DonViTinh` | VARCHAR(20) | NOT NULL (`kg`, `quả`, `ổ`, `phần`…) |
| `TonHienTai` | NUMERIC(15,3) | NOT NULL, DEFAULT 0, **CHECK ≥ 0** — tồn real-time |
| `DinhMucToiThieu` | NUMERIC(15,3) | NOT NULL, DEFAULT 0, **CHECK ≥ 0** — ngưỡng cảnh báo |
| `ThoiGianCapNhatTon` | TIMESTAMP | NULL — lần tồn đổi gần nhất |
| `DangSuDung` | BOOLEAN | NOT NULL, DEFAULT TRUE |

> **Quan trọng:** `TonHienTai` **chỉ** thay đổi qua phiếu nhập/xuất (trong transaction), **không** sửa trực tiếp. NVL mới luôn có tồn = 0, phải lập phiếu nhập để tăng.

### 4.3. `PhieuNhapKho` (header)
| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `PhieuNhapKhoID` | INT IDENTITY | **PK** |
| `MaPhieuNhap` | VARCHAR(20) | UNIQUE, NOT NULL (vd `PN20260529-001`) |
| `NhaCungCapID` | INT | FK → NhaCungCap, NOT NULL |
| `NhanVienLapID` | INT | FK → User, NOT NULL (người lập = token đăng nhập) |
| `NgayNhap` | DATE | NOT NULL |
| `TongGiaTri` | NUMERIC(15,0) | NOT NULL = ∑(SL × đơn giá) |
| `GhiChu` | VARCHAR(500) | NULL |
| `ThoiGianTao` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Index: `ix_phieunhapkho_ngay (NgayNhap)`.

### 4.4. `ChiTietNhapKho` (dòng NVL)
| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `PhieuNhapKhoID` | INT | **PK phần 1**, FK → PhieuNhapKho, **ON DELETE CASCADE** |
| `NguyenLieuID` | INT | **PK phần 2**, FK → NguyenLieu |
| `SoLuong` | NUMERIC(15,3) | NOT NULL, **CHECK > 0** |
| `DonGia` | NUMERIC(15,0) | NOT NULL, **CHECK > 0** |
| `ThanhTien` | NUMERIC(18,3) | **GENERATED ALWAYS AS (SoLuong × DonGia) STORED** (cột tính tự động) |
| `GhiChu` | VARCHAR(200) | NULL |

**PK ghép `(PhieuNhapKhoID, NguyenLieuID)`** → mỗi NVL chỉ 1 dòng/phiếu.

### 4.5. `PhieuXuatKho` (header)
Giống `PhieuNhapKho` nhưng **không có `NhaCungCapID`** (xuất nội bộ cho bếp; nơi nhận ghi vào `GhiChu` nếu cần).
- `PhieuXuatKhoID` PK, `MaPhieuXuat` UNIQUE (vd `PX20260529-001`), `NhanVienLapID` FK→User, `NgayXuat` DATE, `TongGiaTri`, `GhiChu`, `ThoiGianTao`.
- Index: `ix_phieuxuatkho_ngay (NgayXuat)`.

### 4.6. `ChiTietXuatKho` (dòng NVL)
Cấu trúc giống `ChiTietNhapKho`: PK ghép `(PhieuXuatKhoID, NguyenLieuID)`, `ThanhTien` là cột generated, FK ON DELETE CASCADE.

### Sơ đồ quan hệ (header–chi tiết)
```
NhaCungCap ──< PhieuNhapKho ──< ChiTietNhapKho >── NguyenLieu
                                                       │
              PhieuXuatKho ──< ChiTietXuatKho >────────┘
User (NhanVienLapID) ──< PhieuNhapKho / PhieuXuatKho
```

---

## 5. Ràng buộc cấp ứng dụng (do code đảm bảo, không chỉ DB)

| # | Ràng buộc | Cách xử lý |
|---|---|---|
| #3 | `ChiTietXuatKho.SoLuong ≤ NguyenLieu.TonHienTai` tại thời điểm lưu | Transaction + check **ngay trong câu UPDATE** trừ tồn |
| #6 | Cập nhật `TonHienTai` và INSERT phiếu kho trong **CÙNG transaction** | `BEGIN … COMMIT`, lỗi giữa chừng → ROLLBACK |

> Đây là hiện thực của yêu cầu phi chức năng **"Toàn vẹn dữ liệu giao dịch"**: cập nhật tồn kho dùng transaction atomic, rollback nếu lỗi.

---

## 6. Danh sách API (`/kho/*`)

### 6.1. Danh mục NCC & NVL
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/kho/ncc` | Kho, Admin | DS NCC đang dùng |
| POST | `/kho/ncc` | Kho | Thêm (TenNCC trùng → 409) |
| PUT | `/kho/ncc/:id` | Kho | Sửa |
| DELETE | `/kho/ncc/:id` | Kho | **Xóa mềm** (`DangSuDung=FALSE`) |
| GET | `/kho/nguyen-lieu` | Kho, Admin | DS NVL + tồn + định mức. Query `?q=` (tìm theo tên) |
| POST | `/kho/nguyen-lieu` | Kho | Thêm (tồn khởi tạo = 0) |
| PUT | `/kho/nguyen-lieu/:id` | Kho | Sửa tên/ĐVT/định mức (**không** sửa tồn) |
| DELETE | `/kho/nguyen-lieu/:id` | Kho | Xóa mềm |

### 6.2. Phiếu nhập
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/kho/nhap` | Kho, Admin | DS phiếu. Query `?TuNgay=&DenNgay=&NhaCungCapID=` |
| GET | `/kho/nhap/:id` | Kho, Admin | Chi tiết phiếu (K_BM1) |
| POST | `/kho/nhap` | Kho | Lập phiếu nhập (transaction) |

**Request `POST /kho/nhap`:**
```json
{ "NhaCungCapID": 1, "NgayNhap": "2026-05-29", "GhiChu": "",
  "ChiTiet": [ { "NguyenLieuID": 1, "SoLuong": 10, "DonGia": 250000, "GhiChu": "" } ] }
```

### 6.3. Phiếu xuất
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/kho/xuat` | Kho, Admin | DS phiếu. Query `?TuNgay=&DenNgay=` |
| GET | `/kho/xuat/:id` | Kho, Admin | Chi tiết phiếu (K_BM2) |
| POST | `/kho/xuat` | Kho | Lập phiếu xuất (transaction) — trả kèm cảnh báo tồn thấp |

**Request `POST /kho/xuat`:**
```json
{ "NgayXuat": "2026-05-29", "GhiChu": "",
  "ChiTiet": [ { "NguyenLieuID": 1, "SoLuong": 3, "DonGia": 250000, "GhiChu": "" } ] }
```

### 6.4. Báo cáo
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/kho/bao-cao/ton` | Kho, Admin | K_BM3. Query `?TuNgay=&DenNgay=` |
| GET | `/kho/bao-cao/nhap` | Kho, Admin | K_BM4. Query `?TuNgay=&DenNgay=&NhaCungCapID=` |
| GET | `/kho/bao-cao/xuat` | Kho, Admin | K_BM5. Query `?TuNgay=&DenNgay=` |

> Route báo cáo đặt **trước** các route `/:id` để tránh nhầm `bao-cao` thành tham số id.

---

## 7. Logic xử lý cốt lõi (tầng service — dễ bị hỏi sâu)

### 7.1. Sinh mã phiếu
`MaPhieuNhap = 'PN' + yyyymmdd + '-' + STT3` (STT = số phiếu thứ mấy trong ngày, đệm 3 chữ số).
- Ví dụ phiếu nhập thứ 2 ngày 29/05/2026 → `PN20260529-002`.
- Phiếu xuất tiền tố `PX`. STT lấy bằng `COUNT(*) phiếu trong ngày + 1` (thực hiện **trong transaction**).

### 7.2. Lập phiếu nhập (`LapPhieuNhapKho`)
1. Kiểm `NgayNhap` có; NCC tồn tại & đang dùng.
2. `chuanBiChiTiet`: mỗi dòng kiểm NVL tồn tại, `SoLuong > 0`, `DonGia > 0`.
3. Tính `TongGiaTri = ∑(SL × ĐơnGiá)`.
4. **Transaction:** sinh mã → INSERT `PhieuNhapKho` → với mỗi dòng: INSERT `ChiTietNhapKho` + **`CongTonKho`** (`TonHienTai += SoLuong`, cập nhật `ThoiGianCapNhatTon`).
5. Trả về phiếu kèm chi tiết.

### 7.3. Lập phiếu xuất (`LapPhieuXuatKho`) — chống xuất quá tồn
- Kiểm tương tự, **không cần NCC**.
- **Transaction:** INSERT phiếu + chi tiết, rồi trừ tồn bằng câu UPDATE **có điều kiện**:
```sql
UPDATE "NguyenLieu"
SET "TonHienTai" = "TonHienTai" - $2, "ThoiGianCapNhatTon" = CURRENT_TIMESTAMP
WHERE "NguyenLieuID" = $1 AND "TonHienTai" >= $2;
```
- Nếu `rowCount = 0` → tồn không đủ → ném `409 CONFLICT_STATE` "Xuất quá tồn kho" → **tự ROLLBACK**.
- **Vì sao kiểm ngay trong UPDATE?** Tránh tranh chấp (race condition): nếu kiểm `TonHienTai` trước rồi mới trừ, hai phiếu xuất đồng thời có thể cùng đọc tồn cũ và làm âm kho. Gộp điều kiện vào UPDATE → kiểm tra & trừ là 1 thao tác atomic.
- Sau khi commit, gọi `LayNvlDuoiDinhMuc` để trả **cờ cảnh báo** các NVL có `TonHienTai ≤ DinhMucToiThieu`.

### 7.4. Báo cáo tồn kho (`BaoCaoTon`) — phần "khó" nhất
Hệ thống **không lưu lịch sử tồn** (chỉ lưu `TonHienTai` hiện tại), nên tồn đầu/cuối kỳ được **suy ngược** từ tồn hiện tại + lịch sử phiếu:

```
TonCuoi (cuối kỳ) = TonHienTai − ∑Nhập(Ngày > DenNgay) + ∑Xuất(Ngày > DenNgay)
TonDau  (đầu kỳ)  = TonCuoi − NhậpTrongKỳ + XuấtTrongKỳ
```
- `NhậpTrongKỳ` = ∑ `SoLuong` các dòng nhập có `NgayNhap ∈ [TuNgay, DenNgay]`.
- Logic: lấy tồn hiện tại, "tua ngược" các giao dịch sau kỳ để ra tồn cuối kỳ; rồi tua tiếp trong kỳ để ra tồn đầu kỳ.
- Kiểm `TuNgay ≤ DenNgay`, nếu sai → `400 VALIDATION`.

### 7.5. Báo cáo nhập (K_BM4) / xuất (K_BM5)
- Tổng hợp (GROUP BY) theo NVL trong kỳ: tổng SL, tổng giá trị; K_BM4 kèm tên NCC.
- Trả thêm `TongGiaTri` toàn kỳ = ∑ giá trị từng dòng.

---

## 8. Cấu trúc mã nguồn (4 tầng)

Thư mục: `src/modules/kho/`
| File | Vai trò |
|---|---|
| `kho.routes.js` | Khai báo endpoint + middleware `authenticate`/`authorize` |
| `kho.controller.js` | Nhận `req`, bóc tham số, gọi service, trả response chuẩn (`ok`/`created`) |
| `kho.service.js` | **Logic nghiệp vụ**: validate, K_QĐ1, transaction, tính toán báo cáo |
| `kho.repository.js` | Truy vấn SQL thuần (PostgreSQL), không chứa nghiệp vụ |

Tiện ích dùng chung:
- `withTransaction` (`src/config/db.js`) — bao transaction `BEGIN/COMMIT/ROLLBACK`.
- `ngayYYYYMMDD` (`src/utils/maNghiepVu.js`) — định dạng ngày cho mã phiếu.
- `ApiError` — ném lỗi chuẩn (`validation`, `notFound`, `duplicate`, `ruleViolation`, `conflictState`).

> Luồng gọi: **routes → controller → service → repository → DB**. Nghiệp vụ tập trung ở service; repo chỉ thao tác dữ liệu.

### Mã lỗi thường gặp
| HTTP | Mã | Khi nào |
|---|---|---|
| 400 | `VALIDATION` | thiếu trường, khoảng ngày sai |
| 400 | `RULE_VIOLATION` | SL/đơn giá ≤ 0, định mức âm |
| 404 | `NOT_FOUND` | NCC/NVL/phiếu không tồn tại |
| 409 | `DUPLICATE` | trùng tên NCC/NVL |
| 409 | `CONFLICT_STATE` | **xuất quá tồn kho** |

---

## 9. Giao diện (7 màn hình)

**5 màn theo biểu mẫu K_BM** (mỗi màn = 1 biểu mẫu + 1 DFD + endpoint API):
`kho-nhap.html`, `kho-xuat.html`, `kho-bc-ton.html`, `kho-bc-nhap.html`, `kho-bc-xuat.html`.

**2 màn quản lý danh mục** (bổ sung — không thuộc 5 K_BM, dùng API CRUD §4.7.1):
- `kho-nguyen-lieu.html` — thêm/sửa/xóa **nguyên liệu** (không sửa tồn trực tiếp; tồn chỉ đổi qua phiếu).
- `kho-ncc.html` — thêm/sửa/xóa **nhà cung cấp**.

> **Lưu ý phân biệt API vs UI:** backend luôn có sẵn endpoint CRUD cho NVL/NCC (`POST/PUT/DELETE /kho/nguyen-lieu`, `/kho/ncc`). Trước đây UI **chưa** có màn gọi chúng nên trong app chỉ chọn được NVL/NCC nạp sẵn (seed); nay đã bổ sung 2 màn quản lý ở trên.

---

## 10. Dữ liệu mẫu (seed trong `database.sql`)
- **2 NCC:** "Cơ sở cung cấp thịt bò", "Đại lý thực phẩm - đồ khô".
- **12 NVL** (tên, ĐVT, tồn, định mức), ví dụ:
  - Miếng bò né — kg — tồn 30 — định mức 5
  - Trứng — quả — tồn 200 — định mức 30
  - Hành phi — kg — tồn 3 — định mức 0.5
- Tài khoản đăng nhập mặc định mọi vai trò: mật khẩu `matkhau123` (bcrypt).

---

## 11. Câu hỏi vấn đáp dự kiến & gợi ý trả lời

**Q1. Làm sao đảm bảo không xuất quá tồn kho?**
→ Trừ tồn bằng `UPDATE … WHERE TonHienTai >= SoLuong`; nếu `rowCount = 0` thì ném lỗi `409` và rollback. Toàn bộ trong 1 transaction.

**Q2. Vì sao kiểm tồn trong UPDATE mà không kiểm bằng SELECT trước?**
→ Chống race condition. SELECT-rồi-UPDATE là 2 bước, hai phiếu xuất song song có thể cùng đọc tồn cũ → âm kho. Gộp điều kiện vào UPDATE thì kiểm tra và trừ là một thao tác atomic.

**Q3. Tồn đầu kỳ / cuối kỳ tính thế nào khi không lưu lịch sử tồn?**
→ Suy ngược từ `TonHienTai`: `TonCuoi = TonHienTai − ∑nhập sau kỳ + ∑xuất sau kỳ`; `TonDau = TonCuoi − Nhập trong kỳ + Xuất trong kỳ`.

**Q4. Vì sao phiếu nhập/xuất không cho sửa/xóa?**
→ Theo K_QĐ1, đảm bảo toàn vẹn & truy vết. Sai thì lập phiếu điều chỉnh, nên API không có PUT/DELETE cho phiếu.

**Q5. `ThanhTien` lưu ở đâu, có sợ sai lệch không?**
→ Là cột `GENERATED ALWAYS AS (SoLuong * DonGia) STORED` — DB tự tính, không thể nhập sai tay.

**Q6. NVL mới tạo có tồn bằng bao nhiêu? Sửa tồn trực tiếp được không?**
→ Tồn = 0. Không sửa trực tiếp; tồn chỉ đổi qua phiếu nhập/xuất trong transaction.

**Q7. Cảnh báo tồn thấp hoạt động ra sao?**
→ So `TonHienTai ≤ DinhMucToiThieu` (định mức theo từng NVL). Sau khi xuất kho trả kèm danh sách NVL dưới định mức; Dashboard Admin (M8) cũng hiển thị mục C cảnh báo này.

**Q8. Transaction gồm những thao tác nào khi lập phiếu nhập?**
→ INSERT header `PhieuNhapKho` + nhiều dòng `ChiTietNhapKho` + cộng `TonHienTai` từng NVL. Tất cả thành công mới COMMIT; lỗi bất kỳ → ROLLBACK toàn bộ.

**Q9. Xóa NCC/NVL là xóa thật?**
→ Xóa mềm: đặt `DangSuDung = FALSE`, giữ lại để không hỏng FK của các phiếu cũ.

**Q10. Mã phiếu sinh theo quy tắc nào? Có trùng không?**
→ `PN/PX + yyyymmdd + -STT3`; STT = số phiếu trong ngày + 1, đếm trong transaction; cột `MaPhieu*` có ràng buộc UNIQUE.
