// Route M8 — /bao-cao/tong-hop (DESIGN §4.8). Chỉ Admin.
const express = require('express');
const ctrl = require('./baocao.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();
router.use(authenticate);

router.get('/tong-hop', authorize('Admin'), asyncHandler(ctrl.tongHop));

module.exports = router;
