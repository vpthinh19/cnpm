// B_BM2 — Kitchen display + cập nhật trạng thái món (DFD §7.3.2, B_QĐ1). Poll 5s.
(function () {
  var u = App.guard(['Bep', 'Admin']);
  if (!u) return;

  var filter = '';
  var data = [];

  function nap() {
    App.api('/order/bep/hang-cho').then(function (rows) { data = rows; render(); }).catch(App.showError);
  }

  function render() {
    var grid = App.el('kds_grid');
    var rows = data.filter(function (d) { return !filter || d.TrangThai === filter; });
    if (!rows.length) { grid.innerHTML = '<p class="muted">Không có món nào trong hàng chờ.</p>'; return; }
    grid.innerHTML = rows.map(function (d) {
      var cls = d.TrangThai === 'ChoCheBien' ? 'cho' : 'dang';
      var key = d.PhieuOrderID + '_' + d.SoDong;
      var meta, btn;
      if (d.TrangThai === 'ChoCheBien') {
        meta = d.GhiChu ? 'Ghi chú: ' + App.escapeHtml(d.GhiChu) : '&nbsp;';
        btn = '<button class="btn btn-primary btn-block" data-start="' + key + '">Bắt đầu chế biến</button>';
      } else {
        meta = (d.GhiChu ? 'Ghi chú: ' + App.escapeHtml(d.GhiChu) + ' · ' : '') + App.badge('DangCheBien');
        btn = '<button class="btn btn-success btn-block" data-done="' + key + '">Hoàn thành (Đã xong)</button>';
      }
      return '<div class="kds-card ' + cls + '">' +
        '<div class="kds-head"><span class="ban">Bàn ' + App.escapeHtml(d.MaBan) + '</span><span class="time">⏱ ' + App.timeShort(d.ThoiGianChot) + '</span></div>' +
        '<div class="kds-body">' +
          '<div class="kds-mon">' + App.escapeHtml(d.TenMon) + ' × ' + d.SoLuong + '</div>' +
          '<div class="kds-meta">' + meta + '</div>' + btn +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('[data-start]').forEach(function (b) {
      b.addEventListener('click', function () { capNhat(b.getAttribute('data-start'), 'DangCheBien'); });
    });
    grid.querySelectorAll('[data-done]').forEach(function (b) {
      b.addEventListener('click', function () { capNhat(b.getAttribute('data-done'), 'DaXong'); });
    });
  }

  function capNhat(key, trangThai) {
    var x = key.split('_');
    App.api('/order/' + x[0] + '/dong/' + x[1] + '/trang-thai', { method: 'PATCH', body: { TrangThai: trangThai } })
      .then(function () { App.toast(trangThai === 'DaXong' ? 'Đã hoàn thành' : 'Bắt đầu chế biến'); nap(); })
      .catch(function (e) { App.showError(e); nap(); });
  }

  App.el('kds_tabs').querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      App.el('kds_tabs').querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      filter = t.getAttribute('data-filter');
      render();
    });
  });

  nap();
  setInterval(nap, 5000);
})();
