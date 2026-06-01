// Route M2 — /ban/* (DESIGN §4.2). Đọc: Admin/PhucVu/ThuNgan; ghi: Admin.
const express = require('express');
const ctrl = require('./ban.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('Admin', 'PhucVu', 'ThuNgan'), asyncHandler(ctrl.list));
router.get('/:id', authorize('Admin', 'PhucVu', 'ThuNgan'), asyncHandler(ctrl.detail));
router.post('/', authorize('Admin'), asyncHandler(ctrl.create));
router.put('/:id', authorize('Admin'), asyncHandler(ctrl.update));
router.delete('/:id', authorize('Admin'), asyncHandler(ctrl.remove));

module.exports = router;
