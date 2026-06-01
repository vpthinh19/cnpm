// PV_BM4 — Phục vụ món ra bàn (DFD §7.1.4). Poll mỗi 5s.
(function () {
  var u = App.guard(['PhucVu', 'Admin']);
  if (!u) return;

  function nap() {
    App.api('/order/phuc-vu/san-sang').then(function (rows) {
      var tb = App.el('pv_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="6" class="muted">Chưa có món nào sẵn sàng.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (d) {
        return '<tr>' +
          '<td><b>' + App.escapeHtml(d.MaBan) + '</b></td>' +
          '<td>' + App.escapeHtml(d.TenMon) + '</td>' +
          '<td class="center">' + d.SoLuong + '</td>' +
          '<td class="muted">' + (d.GhiChu ? App.escapeHtml(d.GhiChu) : '—') + '</td>' +
          '<td>' + App.timeShort(d.ThoiGianXong) + '</td>' +
          '<td class="center"><button class="btn btn-sm btn-success" data-pv="' + d.PhieuOrderID + '_' + d.SoDong + '">Đã phục vụ</button></td>' +
          '</tr>';
      }).join('');
      tb.querySelectorAll('[data-pv]').forEach(function (b) {
        b.addEventListener('click', function () {
          var x = b.getAttribute('data-pv').split('_');
          App.api('/order/' + x[0] + '/dong/' + x[1] + '/phuc-vu', { method: 'PATCH' })
            .then(function () { App.toast('Đã phục vụ'); nap(); }).catch(function (e) { App.showError(e); nap(); });
        });
      });
    }).catch(App.showError);
  }

  nap();
  setInterval(nap, 5000);
})();
