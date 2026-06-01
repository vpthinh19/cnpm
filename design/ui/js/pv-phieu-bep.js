// PV_BM3 — Phiếu chuyển bếp (DFD §7.1.3). Tra cứu thuần; in tại client.
(function () {
  var u = App.guard(['PhucVu', 'Admin']);
  if (!u) return;

  var banMap = {};

  function napDanhSach() {
    return App.api('/ban').then(function (bans) {
      bans.forEach(function (b) { banMap[b.BanID] = b.MaBan; });
      return App.api('/order', { query: { TrangThai: 'DangPhucVu' } });
    }).then(function (orders) {
      var sel = App.el('pb_order');
      if (!orders.length) { sel.innerHTML = '<option value="">(Không có order đang phục vụ)</option>'; xoaPhieu(); return; }
      sel.innerHTML = orders.map(function (o) {
        return '<option value="' + o.PhieuOrderID + '">Order #' + o.PhieuOrderID + ' — Bàn ' + (banMap[o.BanID] || o.BanID) + '</option>';
      }).join('');
      xemPhieu();
    });
  }

  function xoaPhieu() {
    App.el('pb_ban').textContent = '—'; App.el('pb_ma').textContent = '—'; App.el('pb_gio').textContent = '—';
    App.el('pb_lines').innerHTML = '';
  }

  function xemPhieu() {
    var id = App.el('pb_order').value;
    if (!id) { xoaPhieu(); return; }
    App.api('/order/' + id + '/phieu-bep').then(function (p) {
      App.el('pb_ban').textContent = banMap[p.BanID] || p.BanID;
      App.el('pb_ma').textContent = '#' + p.PhieuOrderID;
      var lines = p.ChiTiet || [];
      App.el('pb_gio').textContent = lines.length ? App.dateTime(lines[0].ThoiGianChot) : '—';
      App.el('pb_lines').innerHTML = lines.length
        ? lines.map(function (d) {
            var ghi = d.GhiChu ? '<br><span class="r-sub">' + App.escapeHtml(d.GhiChu) + '</span>' : '';
            return '<tr><td>' + App.escapeHtml(d.TenMon) + ghi + '</td><td class="num">' + d.SoLuong + '</td></tr>';
          }).join('')
        : '<tr><td colspan="2" class="r-sub">Không có món chờ chế biến.</td></tr>';
    }).catch(App.showError);
  }

  App.on('pb_order', 'change', xemPhieu);
  App.on('pb_print', 'click', function () { window.print(); });
  napDanhSach();
})();
