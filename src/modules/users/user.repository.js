// Tầng repository M1 — quản lý tài khoản "User".
const { query } = require('../../config/db');

// Cột công khai (không bao giờ trả PasswordHash).
const COLS =
  '"UserID", "Username", "FullName", "RoleID", "Status", "FailedLoginCount", "LastLoginAt", "CreatedAt", "UpdatedAt"';

async function DanhSach({ RoleID, Status, q } = {}) {
  const dieuKien = [];
  const params = [];
  if (RoleID) {
    params.push(RoleID);
    dieuKien.push(`"RoleID" = $${params.length}`);
  }
  if (Status) {
    params.push(Status);
    dieuKien.push(`"Status" = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    dieuKien.push(`("FullName" ILIKE $${params.length} OR "Username" ILIKE $${params.length})`);
  }
  const where = dieuKien.length ? `WHERE ${dieuKien.join(' AND ')}` : '';
  const result = await query(`SELECT ${COLS} FROM "User" ${where} ORDER BY "UserID"`, params);
  return result.rows;
}

async function TimTheoID(userID) {
  const result = await query(`SELECT ${COLS} FROM "User" WHERE "UserID" = $1`, [userID]);
  return result.rows[0] || null;
}

async function TonTaiUsername(username) {
  const result = await query('SELECT 1 FROM "User" WHERE "Username" = $1', [username]);
  return result.rows.length > 0;
}

async function Them({ Username, PasswordHash, FullName, RoleID }) {
  const result = await query(
    `INSERT INTO "User" ("Username", "PasswordHash", "FullName", "RoleID")
     VALUES ($1, $2, $3, $4)
     RETURNING ${COLS}`,
    [Username, PasswordHash, FullName, RoleID]
  );
  return result.rows[0];
}

async function CapNhatThongTin(userID, { FullName, RoleID }) {
  const result = await query(
    `UPDATE "User" SET "FullName" = $2, "RoleID" = $3, "UpdatedAt" = CURRENT_TIMESTAMP
     WHERE "UserID" = $1
     RETURNING ${COLS}`,
    [userID, FullName, RoleID]
  );
  return result.rows[0] || null;
}

async function DatTrangThai(userID, status, resetFailed) {
  const extra = resetFailed ? ', "FailedLoginCount" = 0' : '';
  await query(
    `UPDATE "User" SET "Status" = $2${extra}, "UpdatedAt" = CURRENT_TIMESTAMP WHERE "UserID" = $1`,
    [userID, status]
  );
}

async function DatLaiMatKhau(userID, passwordHash) {
  await query(
    `UPDATE "User" SET "PasswordHash" = $2, "FailedLoginCount" = 0, "UpdatedAt" = CURRENT_TIMESTAMP
     WHERE "UserID" = $1`,
    [userID, passwordHash]
  );
}

module.exports = {
  DanhSach,
  TimTheoID,
  TonTaiUsername,
  Them,
  CapNhatThongTin,
  DatTrangThai,
  DatLaiMatKhau,
};
