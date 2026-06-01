// Route M6 (DESIGN §4.6). 3 nhóm prefix: /thanh-toan, /hoa-don, /bao-cao/doanh-thu.
const express = require('express');
const ctrl = require('./thanhtoan.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

// --- /thanh-toan/* ---
const thanhToan = express.Router();
thanhToan.use(authenticate);
thanhToan.get('/xem-truoc/:PhieuOrderID', authorize('ThuNgan'), asyncHandler(ctrl.xemTruoc));
thanhToan.post('/', authorize('ThuNgan'), asyncHandler(ctrl.thanhToan));

// --- /hoa-don/* ---
const hoaDon = express.Router();
hoaDon.use(authenticate);
hoaDon.get('/', authorize('ThuNgan', 'Admin'), asyncHandler(ctrl.listHoaDon));
hoaDon.get('/:id', authorize('ThuNgan', 'Admin'), asyncHandler(ctrl.detailHoaDon));
hoaDon.post('/:id/in', authorize('ThuNgan'), asyncHandler(ctrl.inHoaDon));

// --- /bao-cao/doanh-thu ---
const baoCao = express.Router();
baoCao.use(authenticate);
baoCao.get('/doanh-thu', authorize('ThuNgan', 'Admin'), asyncHandler(ctrl.baoCaoDoanhThu));

module.exports = { thanhToan, hoaDon, baoCao };
