// B_BM1 — Nhận / in phiếu order bếp (DFD §7.3.1). Tra cứu thuần.
// Dùng GET /order/bep/hang-cho (danh sách) + GET /order/:id (chi tiết để in) — cả hai cho vai trò Bếp.
(function () {
  var u = App.guard(['Bep', 'Admin']);
  if (!u) return;

  var banCuaOrder = {}; // PhieuOrderID -> MaBan

  function nap() {
    App.api('/order/bep/hang-cho').then(function (rows) {
      var map = {};
      rows.forEach(function (d) {
        banCuaOrder[d.PhieuOrderID] = d.MaBan;
        var g = map[d.PhieuOrderID] || { PhieuOrderID: d.PhieuOrderID, MaBan: d.MaBan, gio: d.ThoiGianChot, soMon: 0 };
        g.soMon += 1;
        if (d.ThoiGianChot < g.gio) g.gio = d.ThoiGianChot;
        map[d.PhieuOrderID] = g;
      });
      var ds = Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return a.gio < b.gio ? -1 : 1; });
      var tb = App.el('po_list');
      if (!ds.length) { tb.innerHTML = '<tr><td colspan="5" class="muted">Không có phiếu chờ.</td></tr>'; xoaPhieu(); return; }
      tb.innerHTML = ds.map(function (g) {
        return '<tr><td><b>' + App.escapeHtml(g.MaBan) + '</b></td><td>#' + g.PhieuOrderID + '</td><td>' + App.timeShort(g.gio) +
          '</td><td class="center">' + g.soMon + '</td><td><button class="btn btn-sm" data-xem="' + g.PhieuOrderID + '">Xem / In</button></td></tr>';
      }).join('');
      tb.querySelectorAll('[data-xem]').forEach(function (b) {
        b.addEventListener('click', function () { xemPhieu(b.getAttribute('data-xem')); });
      });
      xemPhieu(ds[0].PhieuOrderID);
    }).catch(App.showError);
  }

  function xoaPhieu() {
    App.el('po_ban').textContent = '—'; App.el('po_gio').textContent = '—'; App.el('po_lines').innerHTML = '';
  }

  function xemPhieu(id) {
    App.api('/order/' + id).then(function (o) {
      // Chỉ in món ăn còn "Chờ chế biến" (đồ uống không qua bếp).
      var lines = (o.ChiTiet || []).filter(function (d) { return d.LoaiMon === 'MonAn' && d.TrangThai === 'ChoCheBien'; });
      App.el('po_ban').textContent = banCuaOrder[id] || o.BanID;
      App.el('po_gio').textContent = lines.length ? App.dateTime(lines[0].ThoiGianChot) : '—';
      App.el('po_lines').innerHTML = lines.length
        ? lines.map(function (d) {
            var ghi = d.GhiChu ? '<br><span class="r-sub">' + App.escapeHtml(d.GhiChu) + '</span>' : '';
            return '<tr><td>' + App.escapeHtml(d.TenMon) + ghi + '</td><td class="num">' + d.SoLuong + '</td></tr>';
          }).join('')
        : '<tr><td colspan="2" class="r-sub">Không còn món chờ chế biến.</td></tr>';
    }).catch(App.showError);
  }

  App.on('po_print', 'click', function () { App.print('.receipt'); });
  nap();
})();
