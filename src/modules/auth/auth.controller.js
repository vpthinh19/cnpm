// Tầng controller M1 — Auth.
const service = require('./auth.service');
const { ok } = require('../../utils/response');

async function login(req, res) {
  const { Username, Password } = req.body || {};
  const data = await service.DangNhap(Username, Password);
  return ok(res, data, 'Đăng nhập thành công');
}

// Server stateless: logout chỉ trả 200, client tự xóa token.
async function logout(req, res) {
  return ok(res, null, 'Đã đăng xuất');
}

// Thông tin user hiện tại từ token (đã được authenticate gắn vào req.user).
async function me(req, res) {
  return ok(res, req.user);
}

module.exports = { login, logout, me };
