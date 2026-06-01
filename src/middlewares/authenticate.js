// Middleware xác thực JWT (thực thể hệ thống → tên tiếng Anh).
// Giải mã token, và theo ghi chú §7.6.1 / §4.0: kiểm tra lại User.Status = 'HoatDong'
// mỗi request để thu hồi sớm khi Admin khóa tài khoản giữa phiên.
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { query } = require('../config/db');
const ApiError = require('../utils/ApiError');

module.exports = async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Thiếu hoặc sai định dạng token');
    }
    const token = header.slice(7).trim();

    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET);
    } catch (e) {
      throw ApiError.unauthorized('Token không hợp lệ hoặc đã hết hạn');
    }

    // Thu hồi sớm: kiểm tra trạng thái tài khoản hiện tại.
    const result = await query(
      'SELECT "UserID", "Username", "FullName", "RoleID", "Status" FROM "User" WHERE "UserID" = $1',
      [payload.UserID]
    );
    const u = result.rows[0];
    if (!u || u.Status !== 'HoatDong') {
      throw ApiError.unauthorized('Tài khoản không còn hiệu lực, vui lòng đăng nhập lại');
    }

    req.user = { UserID: u.UserID, Username: u.Username, FullName: u.FullName, RoleID: u.RoleID };
    next();
  } catch (err) {
    next(err);
  }
};
