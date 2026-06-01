// Route M5 — /order/* (DESIGN §4.5). Route tĩnh khai báo trước route tham số.
const express = require('express');
const ctrl = require('./order.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.use(authenticate);

// --- Bảng Bếp / Phục vụ (tĩnh, đặt trước :PhieuOrderID) ---
router.get('/bep/hang-cho', authorize('Bep'), asyncHandler(ctrl.hangChoBep));
router.get('/phuc-vu/san-sang', authorize('PhucVu'), asyncHandler(ctrl.sanSangPhucVu));
router.get('/dang-phuc-vu/:BanID', authorize('PhucVu', 'ThuNgan'), asyncHandler(ctrl.dangPhucVuTheoBan));

// --- Danh sách + mở order ---
router.get('/', authorize('PhucVu', 'ThuNgan'), asyncHandler(ctrl.list));
router.post('/', authorize('PhucVu'), asyncHandler(ctrl.create));

// --- Thao tác trên 1 order ---
router.get('/:PhieuOrderID', authorize('PhucVu', 'ThuNgan', 'Bep'), asyncHandler(ctrl.detail));
router.get('/:PhieuOrderID/phieu-bep', authorize('PhucVu'), asyncHandler(ctrl.phieuBep));
router.post('/:PhieuOrderID/dong', authorize('PhucVu'), asyncHandler(ctrl.themDong));
router.post('/:PhieuOrderID/chot', authorize('PhucVu'), asyncHandler(ctrl.chot));
router.post('/:PhieuOrderID/huy', authorize('PhucVu', 'Admin'), asyncHandler(ctrl.huyOrder));

// --- Thao tác trên 1 dòng món ---
router.put('/:PhieuOrderID/dong/:SoDong', authorize('PhucVu'), asyncHandler(ctrl.suaDong));
router.delete('/:PhieuOrderID/dong/:SoDong', authorize('PhucVu'), asyncHandler(ctrl.xoaDong));
router.patch('/:PhieuOrderID/dong/:SoDong/trang-thai', authorize('Bep'), asyncHandler(ctrl.capNhatTrangThaiMon));
router.patch('/:PhieuOrderID/dong/:SoDong/phuc-vu', authorize('PhucVu'), asyncHandler(ctrl.phucVuMon));
router.patch('/:PhieuOrderID/dong/:SoDong/huy', authorize('PhucVu'), asyncHandler(ctrl.huyDong));

module.exports = router;
