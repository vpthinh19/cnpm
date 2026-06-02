# Bò Né Mỹ Cảnh — Hệ thống quản lý nhà hàng

Đồ án Công nghệ phần mềm. Backend REST API: **Node.js + Express + PostgreSQL**, xác thực **JWT**.
Tài liệu: [`DESCRIPTION.md`](DESCRIPTION.md) (đặc tả + DFD §7), [`DESIGN.md`](DESIGN.md) (thiết kế CSDL/API/pseudocode), [`database.sql`](database.sql) (DDL + seed).

## Yêu cầu
- Node.js ≥ 18
- PostgreSQL ≥ 14

## Cài đặt & chạy

```bash
# 1) Cài thư viện
npm install

# 2) Cấu hình môi trường: copy .env.example -> .env rồi điền PGPASSWORD
#    (mặc định: localhost:5432, user postgres, DB BoNeMyCanh)

# 3) Tạo CSDL + nạp schema/seed
psql -U postgres -c "CREATE DATABASE \"BoNeMyCanh\";"
psql -U postgres -d BoNeMyCanh -f database.sql

# 4) Chạy server (backend API + giao diện web cùng 1 cổng)
npm start          # API: http://localhost:3000/api/v1
# hoặc: npm run dev  (tự reload khi đổi mã)

# 5) Mở giao diện trên trình duyệt
#    http://localhost:3000/  → tự chuyển tới màn đăng nhập
```

## Giao diện web
Frontend HTML/CSS/JS thuần trong `design/ui/` được chính server Express phục vụ (cùng origin với API, không cần CORS). Sau khi `npm start`, mở **http://localhost:3000/** và đăng nhập — hệ thống tự đưa tới giao diện theo vai trò. 19 màn, mỗi màn 1 file JS trong `design/ui/js/`; thư viện chung `js/app.js` lo xác thực JWT, gọi API, phân quyền, định dạng.

## Tài khoản mẫu (mật khẩu: `matkhau123`)
| Username | Vai trò |
|---|---|
| `admin` | Admin |
| `phucvu1` | Phục vụ |
| `bep1` | Bếp |
| `thungan1` | Thu ngân |
| `kho1` | Kho |

## Kiến trúc
Phân tầng **route → controller → service → repository** (DESIGN §1.1). Mọi response theo envelope:
```jsonc
{ "success": true, "data": ... , "message": "..." }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

8 module độc lập dưới prefix `/api/v1`:

| Module | Prefix | Vai trò chính |
|---|---|---|
| M1 Xác thực + Tài khoản | `/auth`, `/users` | Đăng nhập, quản lý tài khoản (Admin) |
| M2 Quản lý bàn | `/ban` | CRUD bàn (Admin) |
| M3 Thực đơn | `/mon-an` | CRUD món (Admin) |
| M4 Đặt bàn | `/dat-ban` | Đặt/nhận/hủy bàn (PhucVu) |
| M5 Order + Bếp | `/order` | Gọi món, chốt bếp, chế biến, phục vụ |
| M6 Thanh toán | `/thanh-toan`, `/hoa-don`, `/bao-cao/doanh-thu` | Thanh toán, hóa đơn, doanh thu (ThuNgan) |
| M7 Kho | `/kho` | NCC, NVL, nhập/xuất, báo cáo kho (Kho) |
| M8 Báo cáo tổng hợp | `/bao-cao/tong-hop` | Dashboard (Admin) |

> Đăng nhập (`POST /api/v1/auth/login`) là endpoint công khai duy nhất; các endpoint khác cần header `Authorization: Bearer <JWT>`.

## Cấu trúc thư mục
```
src/
  config/        constants.js, env.js, db.js (pool pg + transaction)
  middlewares/   authenticate, authorize, errorHandler
  utils/         ApiError, response, asyncHandler, password, jwt, gioHoatDong, maNghiepVu
  modules/       auth, users, ban, monan, datban, order, thanhtoan, kho, baocao
  routes/        index.js (gắn 8 module dưới /api/v1)
  app.js, server.js
```
