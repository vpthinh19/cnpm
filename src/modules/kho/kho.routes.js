// Route M7 — /kho/* (DESIGN §4.7). Ghi: Kho; đọc/báo cáo: Kho + Admin.
const express = require('express');
const ctrl = require('./kho.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();
router.use(authenticate);

const Kho = authorize('Kho');
const KhoAdmin = authorize('Kho', 'Admin');

// --- Báo cáo (đặt trước để rõ ràng) ---
router.get('/bao-cao/ton', KhoAdmin, asyncHandler(ctrl.baoCaoTon));
router.get('/bao-cao/nhap', KhoAdmin, asyncHandler(ctrl.baoCaoNhap));
router.get('/bao-cao/xuat', KhoAdmin, asyncHandler(ctrl.baoCaoXuat));

// --- Nhà cung cấp ---
router.get('/ncc', KhoAdmin, asyncHandler(ctrl.listNCC));
router.post('/ncc', Kho, asyncHandler(ctrl.createNCC));
router.put('/ncc/:id', Kho, asyncHandler(ctrl.updateNCC));
router.delete('/ncc/:id', Kho, asyncHandler(ctrl.removeNCC));

// --- Nguyên liệu ---
router.get('/nguyen-lieu', KhoAdmin, asyncHandler(ctrl.listNVL));
router.post('/nguyen-lieu', Kho, asyncHandler(ctrl.createNVL));
router.put('/nguyen-lieu/:id', Kho, asyncHandler(ctrl.updateNVL));
router.delete('/nguyen-lieu/:id', Kho, asyncHandler(ctrl.removeNVL));

// --- Phiếu nhập ---
router.get('/nhap', KhoAdmin, asyncHandler(ctrl.listNhap));
router.get('/nhap/:id', KhoAdmin, asyncHandler(ctrl.detailNhap));
router.post('/nhap', Kho, asyncHandler(ctrl.createNhap));

// --- Phiếu xuất ---
router.get('/xuat', KhoAdmin, asyncHandler(ctrl.listXuat));
router.get('/xuat/:id', KhoAdmin, asyncHandler(ctrl.detailXuat));
router.post('/xuat', Kho, asyncHandler(ctrl.createXuat));

module.exports = router;
