// Route M1 — /auth/* (DESIGN §4.1.1).
const express = require('express');
const ctrl = require('./auth.controller');
const authenticate = require('../../middlewares/authenticate');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

router.post('/login', asyncHandler(ctrl.login)); // công khai
router.post('/logout', authenticate, asyncHandler(ctrl.logout));
router.get('/me', authenticate, asyncHandler(ctrl.me));

module.exports = router;
