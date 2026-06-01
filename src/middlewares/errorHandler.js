// Middleware xử lý lỗi tập trung — chuyển mọi lỗi thành envelope §4.0.
const ApiError = require('../utils/ApiError');
const { fail } = require('../utils/response');

// 404 cho route không khớp.
function notFoundHandler(req, res) {
  return fail(res, 404, 'NOT_FOUND', `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return fail(res, err.httpStatus, err.code, err.message);
  }

  // Lỗi vi phạm ràng buộc duy nhất của PostgreSQL (23505) → 409 DUPLICATE.
  if (err.code === '23505') {
    return fail(res, 409, 'DUPLICATE', 'Dữ liệu đã tồn tại (vi phạm ràng buộc duy nhất)');
  }

  // Lỗi không lường trước.
  console.error('[ERROR]', err);
  return fail(res, 500, 'INTERNAL', 'Lỗi hệ thống, vui lòng thử lại sau');
}

module.exports = { notFoundHandler, errorHandler };
