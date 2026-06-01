// QL_BM3 — Quản lý tài khoản (DFD §7.5.3, QL_QĐ1).
(function () {
  var me = App.guard(['Admin']);
  if (!me) return;

  var ROLES = [
    { value: 'Admin', label: 'Admin' }, { value: 'PhucVu', label: 'Phục vụ' },
    { value: 'Bep', label: 'Bếp' }, { value: 'ThuNgan', label: 'Thu ngân' }, { value: 'Kho', label: 'Bộ phận Kho' },
  ];
  function roleLabel(r) { return App.ROLE_LABEL[r] || r; }

  function nap() {
    App.api('/users', { query: { q: App.el('qa_search').value.trim(), RoleID: App.el('qa_role').value } }).then(function (rows) {
      var tb = App.el('qa_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="6" class="muted">Không có tài khoản.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (a) {
        var khoaBtn = a.Status === 'HoatDong'
          ? '<button class="btn btn-sm btn-danger" data-khoa="' + a.UserID + '">Khóa</button>'
          : '<button class="btn btn-sm btn-success" data-mokhoa="' + a.UserID + '">Mở khóa</button>';
        return '<tr>' +
          '<td>' + a.UserID + '</td><td>' + App.escapeHtml(a.FullName) + '</td><td>' + App.escapeHtml(a.Username) + '</td>' +
          '<td>' + App.escapeHtml(roleLabel(a.RoleID)) + '</td>' +
          '<td class="center">' + App.badge(a.Status) + '</td>' +
          '<td class="center"><div class="btn-row">' +
            '<button class="btn btn-sm" data-sua="' + a.UserID + '">Sửa</button>' + khoaBtn +
            '<button class="btn btn-sm" data-reset="' + a.UserID + '">Đặt lại MK</button>' +
          '</div></td></tr>';
      }).join('');
      tb.querySelectorAll('[data-sua]').forEach(function (x) {
        x.addEventListener('click', function () { suaTK(rows.filter(function (r) { return r.UserID == x.getAttribute('data-sua'); })[0]); });
      });
      tb.querySelectorAll('[data-khoa]').forEach(function (x) {
        x.addEventListener('click', function () { doiTrangThai(x.getAttribute('data-khoa'), 'lock', 'Đã khóa tài khoản'); });
      });
      tb.querySelectorAll('[data-mokhoa]').forEach(function (x) {
        x.addEventListener('click', function () { doiTrangThai(x.getAttribute('data-mokhoa'), 'unlock', 'Đã mở khóa'); });
      });
      tb.querySelectorAll('[data-reset]').forEach(function (x) {
        x.addEventListener('click', function () { datLaiMK(x.getAttribute('data-reset')); });
      });
    }).catch(App.showError);
  }

  function themTK() {
    App.formModal({
      title: 'Thêm tài khoản', fields: [
        { name: 'Username', label: 'Tên đăng nhập', value: '' },
        { name: 'Password', label: 'Mật khẩu (≥8, có chữ + số)', type: 'password', value: '' },
        { name: 'FullName', label: 'Họ tên', value: '' },
        { name: 'RoleID', label: 'Vai trò', type: 'select', options: ROLES, value: 'PhucVu' },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/users', { method: 'POST', body: { Username: v.Username.trim(), Password: v.Password, FullName: v.FullName.trim(), RoleID: v.RoleID } })
        .then(function () { App.toast('Đã thêm tài khoản'); nap(); }).catch(App.showError);
    });
  }
  function suaTK(a) {
    App.formModal({
      title: 'Sửa ' + a.Username, fields: [
        { name: 'FullName', label: 'Họ tên', value: a.FullName },
        { name: 'RoleID', label: 'Vai trò', type: 'select', options: ROLES, value: a.RoleID },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/users/' + a.UserID, { method: 'PUT', body: { FullName: v.FullName.trim(), RoleID: v.RoleID } })
        .then(function () { App.toast('Đã cập nhật'); nap(); }).catch(App.showError);
    });
  }
  function doiTrangThai(id, action, msg) {
    App.api('/users/' + id + '/' + action, { method: 'PATCH' }).then(function () { App.toast(msg); nap(); }).catch(App.showError);
  }
  function datLaiMK(id) {
    App.formModal({ title: 'Đặt lại mật khẩu', fields: [{ name: 'NewPassword', label: 'Mật khẩu mới (≥8, có chữ + số)', type: 'password', value: '' }] })
      .then(function (v) {
        if (!v) return;
        App.api('/users/' + id + '/reset-password', { method: 'PATCH', body: { NewPassword: v.NewPassword } })
          .then(function () { App.toast('Đã đặt lại mật khẩu'); }).catch(App.showError);
      });
  }

  App.on('qa_them', 'click', themTK);
  App.on('qa_search', 'input', nap);
  App.on('qa_role', 'change', nap);
  nap();
})();
