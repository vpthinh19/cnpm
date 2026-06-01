// Middleware phân quyền: chặn vai trò không nằm trong danh sách cho phép.
// Dùng sau authenticate. VD: authorize('Admin'), authorize('PhucVu', 'ThuNgan').
const ApiError = require('../utils/ApiError');

module.exports = function authorize(...roles) {
  return function (req, res, next) {
    if (!req.user) return next(ApiError.unauthorized('Chưa xác thực'));
    if (roles.length && !roles.includes(req.user.RoleID)) {
      return next(ApiError.forbidden('Vai trò không có quyền với chức năng này'));
    }
    next();
  };
};
