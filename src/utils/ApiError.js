// Lỗi nghiệp vụ có mã HTTP + code (theo bảng mã lỗi DESIGN §4.0).
// Tương ứng với NÉM_LỖI(httpStatus, 'CODE', 'message') trong pseudocode §5.
class ApiError extends Error {
  constructor(httpStatus, code, message) {
    super(message);
    this.name = 'ApiError';
    this.httpStatus = httpStatus;
    this.code = code;
  }
}

// Các shortcut theo bảng mã lỗi §4.0.
ApiError.validation = (msg) => new ApiError(400, 'VALIDATION', msg);
ApiError.ruleViolation = (msg) => new ApiError(400, 'RULE_VIOLATION', msg);
ApiError.unauthorized = (msg) => new ApiError(401, 'UNAUTHORIZED', msg);
ApiError.forbidden = (msg) => new ApiError(403, 'FORBIDDEN', msg);
ApiError.notFound = (msg) => new ApiError(404, 'NOT_FOUND', msg);
ApiError.duplicate = (msg) => new ApiError(409, 'DUPLICATE', msg);
ApiError.conflictState = (msg) => new ApiError(409, 'CONFLICT_STATE', msg);

module.exports = ApiError;
