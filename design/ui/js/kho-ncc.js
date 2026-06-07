// Quản lý danh mục nhà cung cấp (NhaCungCap).
// API: GET/POST /kho/ncc, PUT /kho/ncc/:id, DELETE /kho/ncc/:id
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  function nap() {
    App.api('/kho/ncc').then(function (rows) {
      var tb = App.el('ncc_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="4" class="muted">Chưa có nhà cung cấp.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (n) {
        return '<tr>' +
          '<td>' + App.escapeHtml(n.TenNCC) + '</td>' +
          '<td>' + App.escapeHtml(n.SoDienThoai || '') + '</td>' +
          '<td>' + App.escapeHtml(n.DiaChi || '') + '</td>' +
          '<td class="center"><div class="btn-row">' +
            '<button class="btn btn-sm" data-sua="' + n.NhaCungCapID + '">Sửa</button>' +
            '<button class="btn btn-sm btn-danger" data-xoa="' + n.NhaCungCapID + '">Xóa</button>' +
          '</div></td></tr>';
      }).join('');
      tb.querySelectorAll('[data-sua]').forEach(function (x) {
        x.addEventListener('click', function () { sua(rows.filter(function (r) { return r.NhaCungCapID == x.getAttribute('data-sua'); })[0]); });
      });
      tb.querySelectorAll('[data-xoa]').forEach(function (x) {
        x.addEventListener('click', function () { xoa(rows.filter(function (r) { return r.NhaCungCapID == x.getAttribute('data-xoa'); })[0]); });
      });
    }).catch(App.showError);
  }

  function them() {
    App.formModal({
      title: 'Thêm nhà cung cấp', fields: [
        { name: 'TenNCC', label: 'Tên nhà cung cấp', value: '' },
        { name: 'SoDienThoai', label: 'Số điện thoại', value: '' },
        { name: 'DiaChi', label: 'Địa chỉ', value: '' },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/kho/ncc', { method: 'POST', body: {
        TenNCC: v.TenNCC.trim(), SoDienThoai: v.SoDienThoai.trim(), DiaChi: v.DiaChi.trim(),
      } }).then(function () { App.toast('Đã thêm nhà cung cấp'); nap(); }).catch(App.showError);
    });
  }

  function sua(n) {
    App.formModal({
      title: 'Sửa ' + n.TenNCC, fields: [
        { name: 'TenNCC', label: 'Tên nhà cung cấp', value: n.TenNCC },
        { name: 'SoDienThoai', label: 'Số điện thoại', value: n.SoDienThoai || '' },
        { name: 'DiaChi', label: 'Địa chỉ', value: n.DiaChi || '' },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/kho/ncc/' + n.NhaCungCapID, { method: 'PUT', body: {
        TenNCC: v.TenNCC.trim(), SoDienThoai: v.SoDienThoai.trim(), DiaChi: v.DiaChi.trim(),
      } }).then(function () { App.toast('Đã cập nhật'); nap(); }).catch(App.showError);
    });
  }

  function xoa(n) {
    if (!confirm('Xóa nhà cung cấp "' + n.TenNCC + '"?')) return;
    App.api('/kho/ncc/' + n.NhaCungCapID, { method: 'DELETE' })
      .then(function () { App.toast('Đã xóa nhà cung cấp'); nap(); }).catch(App.showError);
  }

  App.on('ncc_them', 'click', them);
  nap();
})();
