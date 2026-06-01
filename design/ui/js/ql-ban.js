// QL_BM2 — Quản lý bàn (DFD §7.5.2).
(function () {
  var u = App.guard(['Admin']);
  if (!u) return;

  function nap() {
    App.api('/ban', { query: { TrangThai: App.el('qb_trangthai').value } }).then(function (rows) {
      var tb = App.el('qb_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="6" class="muted">Chưa có bàn.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (b) {
        var xoaDisabled = b.TrangThai !== 'Trong' ? ' disabled' : '';
        return '<tr>' +
          '<td>' + App.escapeHtml(b.MaBan) + '</td><td>' + App.escapeHtml(b.KhuVuc) + '</td>' +
          '<td class="center">' + b.SucChua + '</td>' +
          '<td class="center">' + App.badge(b.TrangThai) + '</td>' +
          '<td class="muted">' + (b.GhiChu ? App.escapeHtml(b.GhiChu) : '—') + '</td>' +
          '<td class="center"><div class="btn-row"><button class="btn btn-sm" data-sua="' + b.BanID + '">Sửa</button>' +
          '<button class="btn btn-sm btn-danger" data-xoa="' + b.BanID + '"' + xoaDisabled + '>Xóa</button></div></td></tr>';
      }).join('');
      tb.querySelectorAll('[data-sua]').forEach(function (x) {
        x.addEventListener('click', function () { var b = rows.filter(function (r) { return r.BanID == x.getAttribute('data-sua'); })[0]; suaBan(b); });
      });
      tb.querySelectorAll('[data-xoa]').forEach(function (x) {
        x.addEventListener('click', function () { xoaBan(x.getAttribute('data-xoa')); });
      });
    }).catch(App.showError);
  }

  function fields(b) {
    b = b || {};
    return [
      { name: 'MaBan', label: 'Số bàn', value: b.MaBan },
      { name: 'KhuVuc', label: 'Khu vực', value: b.KhuVuc },
      { name: 'SucChua', label: 'Sức chứa', type: 'number', value: b.SucChua != null ? b.SucChua : 4 },
      { name: 'GhiChu', label: 'Ghi chú', value: b.GhiChu },
    ];
  }

  function themBan() {
    App.formModal({ title: 'Thêm bàn', fields: fields() }).then(function (v) {
      if (!v) return;
      App.api('/ban', { method: 'POST', body: { MaBan: v.MaBan.trim(), KhuVuc: v.KhuVuc.trim(), SucChua: Number(v.SucChua), GhiChu: v.GhiChu.trim() } })
        .then(function () { App.toast('Đã thêm bàn'); nap(); }).catch(App.showError);
    });
  }
  function suaBan(b) {
    App.formModal({ title: 'Sửa bàn ' + b.MaBan, fields: fields(b) }).then(function (v) {
      if (!v) return;
      App.api('/ban/' + b.BanID, { method: 'PUT', body: { MaBan: v.MaBan.trim(), KhuVuc: v.KhuVuc.trim(), SucChua: Number(v.SucChua), GhiChu: v.GhiChu.trim() } })
        .then(function () { App.toast('Đã cập nhật'); nap(); }).catch(App.showError);
    });
  }
  function xoaBan(id) {
    if (!confirm('Xóa bàn này?')) return;
    App.api('/ban/' + id, { method: 'DELETE' }).then(function () { App.toast('Đã xóa bàn'); nap(); }).catch(App.showError);
  }

  App.on('qb_them', 'click', themBan);
  App.on('qb_trangthai', 'change', nap);
  nap();
})();
