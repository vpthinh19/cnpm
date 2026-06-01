// Tiện ích ký JWT (payload UserID + RoleID; hạn theo PHIEN_DANG_NHAP_PHUT).
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { PHIEN_DANG_NHAP_PHUT } = require('../config/constants');

function kyToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: `${PHIEN_DANG_NHAP_PHUT}m` });
}

module.exports = { kyToken };
