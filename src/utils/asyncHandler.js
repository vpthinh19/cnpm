// Bọc handler async để mọi lỗi (kể cả ApiError) chuyển tới errorHandler qua next().
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
