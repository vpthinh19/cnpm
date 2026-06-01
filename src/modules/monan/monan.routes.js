// Route M3 — /mon-an/* (DESIGN §4.3). Đọc: Admin/PhucVu; ghi: Admin.
const express = require('express');
const ctrl = require('./monan.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('Admin', 'PhucVu'), asyncHandler(ctrl.list));
router.get('/:id', authorize('Admin', 'PhucVu'), asyncHandler(ctrl.detail));
router.post('/', authorize('Admin'), asyncHandler(ctrl.create));
router.put('/:id', authorize('Admin'), asyncHandler(ctrl.update));
router.patch('/:id/trang-thai', authorize('Admin'), asyncHandler(ctrl.changeStatus));
router.delete('/:id', authorize('Admin'), asyncHandler(ctrl.remove));

module.exports = router;
