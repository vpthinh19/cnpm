// QL_BM1 — Quản lý thực đơn (DFD §7.5.1).
(function () {
  var u = App.guard(['Admin']);
  if (!u) return;

  var LOAI = [{ value: 'MonAn', label: 'Món ăn' }, { value: 'DoUong', label: 'Đồ uống' }];

  function nap() {
    App.api('/mon-an', { query: { q: App.el('qm_search').value.trim(), LoaiMon: App.el('qm_loai').value, TrangThai: App.el('qm_trangthai').value } })
      .then(function (rows) {
        var tb = App.el('qm_list');
        if (!rows.length) { tb.innerHTML = '<tr><td colspan="6" class="muted">Chưa có món.</td></tr>'; return; }
        tb.innerHTML = rows.map(function (m) {
          var doiNhan = m.TrangThai === 'ConHang' ? 'Hết hàng' : 'Còn hàng';
          return '<tr>' +
            '<td>' + App.escapeHtml(m.MaMonAn) + '</td><td>' + App.escapeHtml(m.TenMon) + '</td>' +
            '<td><span class="tag-loai">' + (m.LoaiMon === 'MonAn' ? 'Món ăn' : 'Đồ uống') + '</span></td>' +
            '<td class="num money">' + App.money(m.DonGia) + '</td>' +
            '<td class="center">' + App.badge(m.TrangThai) + '</td>' +
            '<td class="center"><div class="btn-row">' +
              '<button class="btn btn-sm" data-sua="' + m.MonAnID + '">Sửa</button>' +
              '<button class="btn btn-sm" data-tt="' + m.MonAnID + '">' + doiNhan + '</button>' +
              '<button class="btn btn-sm btn-danger" data-xoa="' + m.MonAnID + '">Xóa</button>' +
            '</div></td></tr>';
        }).join('');
        tb.querySelectorAll('[data-sua]').forEach(function (x) {
          x.addEventListener('click', function () { suaMon(rows.filter(function (r) { return r.MonAnID == x.getAttribute('data-sua'); })[0]); });
        });
        tb.querySelectorAll('[data-tt]').forEach(function (x) {
          x.addEventListener('click', function () { doiTrangThai(rows.filter(function (r) { return r.MonAnID == x.getAttribute('data-tt'); })[0]); });
        });
        tb.querySelectorAll('[data-xoa]').forEach(function (x) {
          x.addEventListener('click', function () { xoaMon(x.getAttribute('data-xoa')); });
        });
      }).catch(App.showError);
  }

  function themMon() {
    App.formModal({
      title: 'Thêm món', fields: [
        { name: 'MaMonAn', label: 'Mã sản phẩm', value: '' },
        { name: 'TenMon', label: 'Tên món', value: '' },
        { name: 'LoaiMon', label: 'Loại', type: 'select', options: LOAI, value: 'MonAn' },
        { name: 'DonGia', label: 'Đơn giá', type: 'number', value: 0 },
        { name: 'MoTa', label: 'Mô tả', type: 'textarea', value: '' },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/mon-an', { method: 'POST', body: { MaMonAn: v.MaMonAn.trim(), TenMon: v.TenMon.trim(), LoaiMon: v.LoaiMon, DonGia: Number(v.DonGia), MoTa: v.MoTa.trim() } })
        .then(function () { App.toast('Đã thêm món'); nap(); }).catch(App.showError);
    });
  }
  function suaMon(m) {
    App.formModal({
      title: 'Sửa món ' + m.TenMon, fields: [
        { name: 'TenMon', label: 'Tên món', value: m.TenMon },
        { name: 'LoaiMon', label: 'Loại', type: 'select', options: LOAI, value: m.LoaiMon },
        { name: 'DonGia', label: 'Đơn giá', type: 'number', value: m.DonGia },
        { name: 'MoTa', label: 'Mô tả', type: 'textarea', value: m.MoTa },
      ]
    }).then(function (v) {
      if (!v) return;
      App.api('/mon-an/' + m.MonAnID, { method: 'PUT', body: { TenMon: v.TenMon.trim(), LoaiMon: v.LoaiMon, DonGia: Number(v.DonGia), MoTa: v.MoTa.trim() } })
        .then(function () { App.toast('Đã cập nhật'); nap(); }).catch(App.showError);
    });
  }
  function doiTrangThai(m) {
    var moi = m.TrangThai === 'ConHang' ? 'HetHang' : 'ConHang';
    App.api('/mon-an/' + m.MonAnID + '/trang-thai', { method: 'PATCH', body: { TrangThai: moi } })
      .then(function () { App.toast('Đã đổi trạng thái'); nap(); }).catch(App.showError);
  }
  function xoaMon(id) {
    if (!confirm('Xóa món này?')) return;
    App.api('/mon-an/' + id, { method: 'DELETE' }).then(function () { App.toast('Đã xóa món'); nap(); }).catch(App.showError);
  }

  App.on('qm_them', 'click', themMon);
  App.on('qm_search', 'input', nap);
  App.on('qm_loai', 'change', nap);
  App.on('qm_trangthai', 'change', nap);
  nap();
})();
