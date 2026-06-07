// Quản lý danh mục nguyên liệu (NguyenLieu).
// Tồn hiện tại chỉ thay đổi qua phiếu nhập/xuất → form thêm/sửa không có trường tồn.
// API: GET/POST /kho/nguyen-lieu, PUT /kho/nguyen-lieu/:id, DELETE /kho/nguyen-lieu/:id
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  function nap() {
    App.api('/kho/nguyen-lieu', { query: { q: App.el('nl_search').value.trim() } }).then(function (rows) {
      var tb = App.el('nl_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="5" class="muted">Chưa có nguyên liệu.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (n) {
        return '<tr>' +
          '<td>' + App.escapeHtml(n.TenNVL) + '</td>' +
          '<td>' + App.escapeHtml(n.DonViTinh) + '</td>' +
          '<td class="num">' + App.qty(n.TonHienTai) + '</td>' +
          '<td class="num">' + App.qty(n.DinhMucToiThieu) + '</td>' +
          '<td class="center"><div class="btn-row">' +
            '<button class="btn btn-sm" data-sua="' + n.NguyenLieuID + '">Sửa</button>' +
            '<button class="btn btn-sm btn-danger" data-xoa="' + n.NguyenLieuID + '">Xóa</button>' +
          '</div></td></tr>';
      }).join('');
      tb.querySelectorAll('[data-sua]').forEach(function (x) {
        x.addEventListener('click', function () { sua(rows.filter(function (r) { return r.NguyenLieuID == x.getAttribute('data-sua'); })[0]); });
      });
      tb.querySelectorAll('[data-xoa]').forEach(function (x) {
        x.addEventListener('click', function () { xoa(rows.filter(function (r) { return r.NguyenLieuID == x.getAttribute('data-xoa'); })[0]); });
      });
    }).catch(App.showError);
  }

  function them() {
    App.formModal({
      title: 'Thêm nguyên liệu', fields: [
        { name: 'TenNVL', label: 'Tên nguyên liệu', value: '' },
        { name: 'DonViTinh', label: 'Đơn vị tính (kg, quả, ổ, phần…)', value: '' },
        { name: 'DinhMucToiThieu', label: 'Định mức tối thiểu', type: 'number', value: 0 },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/kho/nguyen-lieu', { method: 'POST', body: {
        TenNVL: v.TenNVL.trim(), DonViTinh: v.DonViTinh.trim(), DinhMucToiThieu: Number(v.DinhMucToiThieu) || 0,
      } }).then(function () { App.toast('Đã thêm nguyên liệu'); nap(); }).catch(App.showError);
    });
  }

  function sua(n) {
    App.formModal({
      title: 'Sửa ' + n.TenNVL, fields: [
        { name: 'TenNVL', label: 'Tên nguyên liệu', value: n.TenNVL },
        { name: 'DonViTinh', label: 'Đơn vị tính', value: n.DonViTinh },
        { name: 'DinhMucToiThieu', label: 'Định mức tối thiểu', type: 'number', value: n.DinhMucToiThieu },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/kho/nguyen-lieu/' + n.NguyenLieuID, { method: 'PUT', body: {
        TenNVL: v.TenNVL.trim(), DonViTinh: v.DonViTinh.trim(), DinhMucToiThieu: Number(v.DinhMucToiThieu) || 0,
      } }).then(function () { App.toast('Đã cập nhật'); nap(); }).catch(App.showError);
    });
  }

  function xoa(n) {
    if (!confirm('Xóa nguyên liệu "' + n.TenNVL + '"?')) return;
    App.api('/kho/nguyen-lieu/' + n.NguyenLieuID, { method: 'DELETE' })
      .then(function () { App.toast('Đã xóa nguyên liệu'); nap(); }).catch(App.showError);
  }

  App.on('nl_them', 'click', them);
  App.on('nl_search', 'input', nap);
  nap();
})();
