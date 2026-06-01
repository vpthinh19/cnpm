// Router tổng — gắn toàn bộ module dưới prefix /api/v1 (DESIGN §4.0).
const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const banRoutes = require('../modules/ban/ban.routes');
const monAnRoutes = require('../modules/monan/monan.routes');
const datBanRoutes = require('../modules/datban/datban.routes');
const orderRoutes = require('../modules/order/order.routes');
const thanhToanRoutes = require('../modules/thanhtoan/thanhtoan.routes');
const khoRoutes = require('../modules/kho/kho.routes');
const baoCaoRoutes = require('../modules/baocao/baocao.routes');

const router = express.Router();

// Health check đơn giản.
router.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

// M1 — Xác thực + Tài khoản
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// M2 — Quản lý bàn
router.use('/ban', banRoutes);

// M3 — Thực đơn
router.use('/mon-an', monAnRoutes);

// M4 — Đặt bàn
router.use('/dat-ban', datBanRoutes);

// M5 — Order + Bếp
router.use('/order', orderRoutes);

// M6 — Thanh toán (3 prefix)
router.use('/thanh-toan', thanhToanRoutes.thanhToan);
router.use('/hoa-don', thanhToanRoutes.hoaDon);
router.use('/bao-cao', thanhToanRoutes.baoCao);

// M7 — Kho
router.use('/kho', khoRoutes);

// M8 — Báo cáo tổng hợp (Dashboard Admin) — thêm vào nhánh /bao-cao
router.use('/bao-cao', baoCaoRoutes);

module.exports = router;
