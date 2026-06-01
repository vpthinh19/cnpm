// Tầng repository M1 — truy vấn bảng "User" phục vụ đăng nhập.
const { query } = require('../../config/db');

async function TimUserTheoUsername(username) {
  const result = await query(
    `SELECT "UserID", "Username", "PasswordHash", "FullName", "RoleID", "Status", "FailedLoginCount"
     FROM "User" WHERE "Username" = $1`,
    [username]
  );
  return result.rows[0] || null;
}

// Cập nhật trạng thái đăng nhập sau khi so khớp mật khẩu.
async function CapNhatSauDangNhap(userID, { FailedLoginCount, Status, capNhatLastLogin }) {
  const sets = ['"FailedLoginCount" = $2'];
  const params = [userID, FailedLoginCount];
  if (Status) {
    params.push(Status);
    sets.push(`"Status" = $${params.length}`);
  }
  if (capNhatLastLogin) {
    sets.push('"LastLoginAt" = CURRENT_TIMESTAMP');
  }
  await query(`UPDATE "User" SET ${sets.join(', ')} WHERE "UserID" = $1`, params);
}

module.exports = { TimUserTheoUsername, CapNhatSauDangNhap };
