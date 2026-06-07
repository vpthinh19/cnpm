/* ============================================================
   Thư viện dùng chung cho frontend Bò Né Mỹ Cảnh (vanilla JS).
   - Lưu/đọc JWT + user (localStorage)
   - api(): gọi REST /api/v1 kèm Bearer, xử lý envelope + lỗi
   - guard(): chặn truy cập theo vai trò
   - Tiện ích: format tiền/ngày, badge, toast, render user/đăng xuất
   ============================================================ */
(function (global) {
  'use strict';

  var API_BASE = '/api/v1';
  var KEY_TOKEN = 'bnmc_token';
  var KEY_USER = 'bnmc_user';

  // Vai trò → nhãn hiển thị + trang chủ sau đăng nhập.
  var ROLE_LABEL = { Admin: 'Quản lý', PhucVu: 'Phục vụ', Bep: 'Bếp', ThuNgan: 'Thu ngân', Kho: 'Bộ phận Kho' };
  var ROLE_HOME = {
    Admin: 'ql-dashboard.html',
    PhucVu: 'pv-dat-ban.html',
    Bep: 'bep-kitchen-display.html',
    ThuNgan: 'tn-thanh-toan.html',
    Kho: 'kho-nhap.html',
  };

  /* ---------- Phiên đăng nhập ---------- */
  function token() { return localStorage.getItem(KEY_TOKEN); }
  function user() {
    try { return JSON.parse(localStorage.getItem(KEY_USER)); } catch (e) { return null; }
  }
  function setSession(tk, u) {
    localStorage.setItem(KEY_TOKEN, tk);
    localStorage.setItem(KEY_USER, JSON.stringify(u));
  }
  function clearSession() {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
  }
  function logout() {
    // Server stateless: chỉ cần xóa token phía client (DFD §7.6.1 Bước 7).
    clearSession();
    location.href = 'dang-nhap.html';
  }

  /* ---------- Gọi API ---------- */
  // api(path, { method, body, query }) → Promise<data>. Ném {code,message,status} nếu lỗi.
  function api(path, opts) {
    opts = opts || {};
    var url = API_BASE + path;
    if (opts.query) {
      var qs = Object.keys(opts.query)
        .filter(function (k) { return opts.query[k] !== undefined && opts.query[k] !== null && opts.query[k] !== ''; })
        .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(opts.query[k]); })
        .join('&');
      if (qs) url += '?' + qs;
    }
    var headers = {};
    var tk = token();
    if (tk) headers['Authorization'] = 'Bearer ' + tk;
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

    return fetch(url, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    }).then(function (res) {
      return res.json().then(function (json) {
        if (res.ok && json && json.success) return json.data;
        var err = (json && json.error) || { code: 'UNKNOWN', message: 'Lỗi không xác định' };
        err.status = res.status;
        // Token hết hạn / không hợp lệ → về màn đăng nhập.
        if (res.status === 401 && !/\/auth\/login$/.test(path)) {
          clearSession();
          location.href = 'dang-nhap.html';
        }
        throw err;
      });
    });
  }

  /* ---------- Phân quyền màn ---------- */
  // guard(rolesChoPhep) → trả user nếu hợp lệ, ngược lại điều hướng.
  function guard(roles) {
    var u = user();
    if (!token() || !u) { location.href = 'dang-nhap.html'; return null; }
    if (roles && roles.indexOf(u.RoleID) === -1) {
      location.href = ROLE_HOME[u.RoleID] || 'dang-nhap.html';
      return null;
    }
    renderTopbarUser(u);
    return u;
  }

  // Đổ thông tin user + nút đăng xuất vào topbar (.user).
  function renderTopbarUser(u) {
    var box = document.querySelector('.topbar .user');
    if (!box) return;
    var ten = u.FullName || u.Username;
    var chu = (ten || '?').trim().charAt(0).toUpperCase();
    box.innerHTML =
      '<div class="avatar">' + escapeHtml(chu) + '</div>' +
      '<div><div>' + escapeHtml(ten) + '</div><div class="role">' + escapeHtml(ROLE_LABEL[u.RoleID] || u.RoleID) + '</div></div>' +
      '<button class="btn btn-sm" id="btnLogout" style="margin-left:14px">Đăng xuất</button>';
    var btn = document.getElementById('btnLogout');
    if (btn) btn.addEventListener('click', logout);
  }

  /* ---------- Tiện ích định dạng ---------- */
  function money(n) {
    if (n === null || n === undefined || n === '') return '';
    return Number(n).toLocaleString('vi-VN');
  }
  function qty(n) {
    // Bỏ số 0 thừa ở phần thập phân (vd 30.000 -> 30; 0.500 -> 0,5).
    if (n === null || n === undefined || n === '') return '';
    return Number(n).toLocaleString('vi-VN', { maximumFractionDigits: 3 });
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ' ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  function timeShort(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function dateVN(s) {
    if (!s) return '';
    var d = new Date(s);
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Badge trạng thái → class màu + nhãn.
  var BADGE = {
    // Bàn
    Trong: ['gray', 'Trống'], DaDat: ['blue', 'Đã đặt'], CoKhach: ['green', 'Có khách'],
    // Phiếu đặt bàn
    DaNhanBan: ['green', 'Đã nhận bàn'], DaHuy: ['red', 'Đã hủy'],
    // Dòng món
    ChuaChot: ['gray', 'Chưa chốt'], ChoCheBien: ['amber', 'Chờ chế biến'], DangCheBien: ['amber', 'Đang chế biến'],
    DaXong: ['blue', 'Đã xong'], DaPhucVu: ['green', 'Đã phục vụ'],
    // Order
    DangPhucVu: ['green', 'Đang phục vụ'], DaThanhToan: ['gray', 'Đã thanh toán'],
    // Món / tài khoản
    ConHang: ['green', 'Còn hàng'], HetHang: ['red', 'Hết hàng'],
    HoatDong: ['green', 'Hoạt động'], DaKhoa: ['red', 'Đã khóa'],
  };
  function badge(code) {
    var b = BADGE[code] || ['gray', code];
    return '<span class="badge ' + b[0] + '">' + escapeHtml(b[1]) + '</span>';
  }
  function trangThaiLabel(code) { return (BADGE[code] || ['', code])[1]; }

  /* ---------- Toast thông báo ---------- */
  function toast(msg, type) {
    var box = document.getElementById('bnmc-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'bnmc-toast';
      box.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px';
      document.body.appendChild(box);
    }
    var el = document.createElement('div');
    var bg = type === 'error' ? '#dc2626' : (type === 'warn' ? '#d97706' : '#16a34a');
    el.style.cssText = 'background:' + bg + ';color:#fff;padding:11px 16px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.18);font-size:13.5px;max-width:340px';
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .4s'; el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 400); }, 3200);
  }
  // Chuẩn hóa hiển thị lỗi từ api().
  function showError(err) {
    toast((err && err.message) || 'Có lỗi xảy ra', 'error');
  }

  /* ---------- Modal form dùng chung (thêm/sửa) ---------- */
  // formModal({ title, fields:[{name,label,type,options,value}] }) -> Promise(values|null)
  function formModal(opts) {
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:9998;display:grid;place-items:center';
      var card = document.createElement('div');
      card.className = 'card';
      card.style.cssText = 'width:420px;max-width:92vw;margin:0;max-height:90vh;overflow:auto';
      var body = opts.fields.map(function (f) {
        var input;
        if (f.type === 'select') {
          input = '<select id="mf_' + f.name + '">' + f.options.map(function (o) {
            return '<option value="' + escapeHtml(o.value) + '"' + (String(o.value) === String(f.value) ? ' selected' : '') + '>' + escapeHtml(o.label) + '</option>';
          }).join('') + '</select>';
        } else if (f.type === 'textarea') {
          input = '<textarea id="mf_' + f.name + '">' + escapeHtml(f.value || '') + '</textarea>';
        } else {
          input = '<input type="' + (f.type || 'text') + '" id="mf_' + f.name + '" value="' + escapeHtml(f.value != null ? f.value : '') + '">';
        }
        return '<div class="field" style="margin-bottom:12px"><label>' + escapeHtml(f.label) + '</label>' + input + '</div>';
      }).join('');
      card.innerHTML = '<div class="card-head"><h2>' + escapeHtml(opts.title) + '</h2></div><div class="card-body">' + body +
        '<div class="btn-row" style="margin-top:8px;justify-content:flex-end"><button class="btn" id="mf_cancel">Hủy</button><button class="btn btn-primary" id="mf_ok">Lưu</button></div></div>';
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      function close() { overlay.remove(); }
      card.querySelector('#mf_cancel').addEventListener('click', function () { close(); resolve(null); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) { close(); resolve(null); } });
      card.querySelector('#mf_ok').addEventListener('click', function () {
        var vals = {};
        opts.fields.forEach(function (f) { vals[f.name] = document.getElementById('mf_' + f.name).value; });
        close();
        resolve(vals);
      });
    });
  }

  /* ---------- Combobox gõ-để-tìm (dropdown có style, lọc bỏ dấu) ---------- */
  // Bỏ dấu tiếng Việt để tìm không phân biệt dấu (gõ "pho" khớp "Bánh phở").
  function boDau(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  }
  // combobox({ items:[{label, meta?, ...}], placeholder, onChange(item|null) })
  //   -> { el, get(), set(item), clear(), setItems(list), focus(), destroy() }
  function combobox(opts) {
    opts = opts || {};
    var items = opts.items || [];
    var selected = null, activeIdx = -1, filtered = items.slice();

    var wrap = document.createElement('div');
    wrap.className = 'cbx';
    var input = document.createElement('input');
    input.type = 'text'; input.className = 'cbx-input'; input.autocomplete = 'off';
    input.placeholder = opts.placeholder || '';
    wrap.appendChild(input);

    var panel = document.createElement('div');
    panel.className = 'cbx-panel'; panel.style.display = 'none';
    document.body.appendChild(panel);

    function moPanel() { return panel.style.display !== 'none'; }
    function position() {
      var r = input.getBoundingClientRect();
      panel.style.left = r.left + 'px';
      panel.style.top = (r.bottom + 2) + 'px';
      panel.style.width = r.width + 'px';
    }
    function render() {
      var q = boDau(input.value.trim());
      filtered = q ? items.filter(function (it) { return boDau(it.label).indexOf(q) !== -1; }) : items.slice();
      if (activeIdx >= filtered.length) activeIdx = filtered.length - 1;
      if (!filtered.length) { panel.innerHTML = '<div class="cbx-empty">Không tìm thấy</div>'; return; }
      panel.innerHTML = filtered.map(function (it, i) {
        return '<div class="cbx-opt' + (i === activeIdx ? ' active' : '') + '" data-i="' + i + '">' +
          '<span>' + escapeHtml(it.label) + '</span>' +
          (it.meta != null && it.meta !== '' ? '<span class="cbx-meta">' + escapeHtml(it.meta) + '</span>' : '') +
          '</div>';
      }).join('');
      panel.querySelectorAll('.cbx-opt').forEach(function (node) {
        node.addEventListener('mousedown', function (e) { e.preventDefault(); pick(filtered[Number(node.getAttribute('data-i'))]); });
      });
    }
    function open() { position(); panel.style.display = 'block'; render(); bindScroll(true); }
    function close() { panel.style.display = 'none'; bindScroll(false); }
    function pick(it) {
      selected = it || null;
      input.value = it ? it.label : '';
      close();
      if (opts.onChange) opts.onChange(selected);
    }
    function scrollActive() { var a = panel.querySelector('.cbx-opt.active'); if (a) a.scrollIntoView({ block: 'nearest' }); }
    function onScroll() { if (moPanel()) position(); }
    function bindScroll(on) {
      if (on) { window.addEventListener('scroll', onScroll, true); window.addEventListener('resize', onScroll); }
      else { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); }
    }

    input.addEventListener('focus', open);
    input.addEventListener('input', function () {
      selected = null; activeIdx = -1;
      if (moPanel()) render(); else open();
      if (opts.onChange) opts.onChange(null);
    });
    input.addEventListener('blur', function () { setTimeout(close, 120); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!moPanel()) open(); activeIdx = Math.min(activeIdx + 1, filtered.length - 1); render(); scrollActive(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); render(); scrollActive(); }
      else if (e.key === 'Enter') { if (moPanel() && filtered[activeIdx]) { e.preventDefault(); pick(filtered[activeIdx]); } }
      else if (e.key === 'Escape') { close(); }
    });

    return {
      el: wrap,
      get: function () { return selected; },
      set: function (it) { selected = it || null; input.value = it ? it.label : ''; },
      clear: function () { selected = null; input.value = ''; },
      setItems: function (list) { items = list || []; },
      focus: function () { input.focus(); },
      destroy: function () { bindScroll(false); panel.remove(); },
    };
  }

  /* ---------- In ấn ---------- */
  // print(selector): chỉ in đúng vùng cần (phiếu/hóa đơn/báo cáo), không in
  // cả sidebar/topbar/toolbar. Đánh dấu tạm class .print-area cho phần tử
  // được chọn rồi gọi window.print(); CSS @media print lo phần ẩn/hiện.
  function print(selector) {
    var node = document.querySelector(selector);
    if (!node) { window.print(); return; }
    node.classList.add('print-area');
    document.body.classList.add('printing');
    function cleanup() {
      document.body.classList.remove('printing');
      node.classList.remove('print-area');
      window.removeEventListener('afterprint', cleanup);
    }
    window.addEventListener('afterprint', cleanup);
    window.print();
  }

  /* ---------- Helper DOM ---------- */
  function el(id) { return document.getElementById(id); }
  function on(id, ev, fn) { var e = el(id); if (e) e.addEventListener(ev, fn); }

  global.App = {
    api: api, guard: guard, logout: logout, setSession: setSession, token: token, user: user,
    money: money, qty: qty, dateTime: dateTime, timeShort: timeShort, dateVN: dateVN, todayISO: todayISO,
    escapeHtml: escapeHtml, badge: badge, trangThaiLabel: trangThaiLabel,
    toast: toast, showError: showError, el: el, on: on, formModal: formModal, combobox: combobox, print: print,
    ROLE_LABEL: ROLE_LABEL, ROLE_HOME: ROLE_HOME,
  };
})(window);
