// Kiểm tra một mốc thời gian có nằm trong giờ hoạt động [GIO_MO, GIO_DONG] không.
const { GIO_MO, GIO_DONG } = require('../config/constants');

function phut(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// thoiGian: chuỗi ISO hoặc Date. So theo giờ-phút trong ngày (giờ local của server LAN).
function trongGioHoatDong(thoiGian) {
  const d = new Date(thoiGian);
  if (Number.isNaN(d.getTime())) return false;
  const cur = d.getHours() * 60 + d.getMinutes();
  return cur >= phut(GIO_MO) && cur <= phut(GIO_DONG);
}

module.exports = { trongGioHoatDong };
