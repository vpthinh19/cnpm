// Route M4 — /dat-ban/* (DESIGN §4.4). PhucVu thao tác; Admin xem.
const express = require('express');
const ctrl = require('./datban.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('PhucVu', 'Admin'), asyncHandler(ctrl.list));
router.get('/:id', authorize('PhucVu', 'Admin'), asyncHandler(ctrl.detail));
router.post('/', authorize('PhucVu'), asyncHandler(ctrl.create));
router.post('/:id/nhan-ban', authorize('PhucVu'), asyncHandler(ctrl.nhanBan));
router.post('/:id/huy', authorize('PhucVu'), asyncHandler(ctrl.huy));

module.exports = router;
