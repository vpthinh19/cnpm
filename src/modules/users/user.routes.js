// Route M1 — /users/* (DESIGN §4.1.2). Toàn bộ yêu cầu vai trò Admin.
const express = require('express');
const ctrl = require('./user.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.use(authenticate, authorize('Admin'));

router.get('/', asyncHandler(ctrl.list));
router.get('/:id', asyncHandler(ctrl.detail));
router.post('/', asyncHandler(ctrl.create));
router.put('/:id', asyncHandler(ctrl.update));
router.patch('/:id/lock', asyncHandler(ctrl.lock));
router.patch('/:id/unlock', asyncHandler(ctrl.unlock));
router.patch('/:id/reset-password', asyncHandler(ctrl.resetPassword));

module.exports = router;
