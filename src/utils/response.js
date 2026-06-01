// Helper trả response theo envelope thống nhất (DESIGN §4.0).

// Thành công: { success: true, data, message? }
function ok(res, data, message, httpStatus = 200) {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(httpStatus).json(body);
}

// Tạo mới (201) — trả bản ghi vừa tạo.
function created(res, data, message) {
  return ok(res, data, message, 201);
}

// Thất bại: { success: false, error: { code, message } }
function fail(res, httpStatus, code, message) {
  return res.status(httpStatus).json({ success: false, error: { code, message } });
}

module.exports = { ok, created, fail };
