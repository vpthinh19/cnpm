// Router tổng — gắn toàn bộ module dưới prefix /api/v1 (DESIGN §4.0).
const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const banRoutes = require('../modules/ban/ban.routes');
const monAnRoutes = require('../modules/monan/monan.routes');
const datBanRoutes = require('../modules/datban/datban.routes');
const orderRoutes = require('../modules/order/order.routes');

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

// Các module M6–M8 sẽ gắn ở các đợt sau.

module.exports = router;
