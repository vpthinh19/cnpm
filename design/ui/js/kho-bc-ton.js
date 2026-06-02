// K_BM3 — Báo cáo tồn kho (DFD §7.4.2). Chỉ đọc.
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  function xem() {
    var TuNgay = App.el('bt_tu').value, DenNgay = App.el('bt_den').value;
    if (!TuNgay || !DenNgay) { App.toast('Chọn khoảng ngày', 'warn'); return; }
    App.api('/kho/bao-cao/ton', { query: { TuNgay: TuNgay, DenNgay: DenNgay } }).then(function (rows) {
      App.el('bt_range').textContent = 'Tồn kho — ' + App.dateVN(TuNgay) + ' đến ' + App.dateVN(DenNgay);
      var tb = App.el('bt_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="7" class="muted">Không có dữ liệu.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (r, i) {
        var canhBao = Number(r.TonCuoi) <= 0;
        return '<tr><td>' + (i + 1) + '</td><td>' + App.escapeHtml(r.TenNVL) + '</td><td>' + App.escapeHtml(r.DonViTinh) +
          '</td><td class="num">' + App.qty(r.TonDau) + '</td><td class="num">' + App.qty(r.Nhap) + '</td><td class="num">' + App.qty(r.Xuat) +
          '</td><td class="num"' + (canhBao ? ' style="color:var(--c-danger)"' : '') + '>' + App.qty(r.TonCuoi) + '</td></tr>';
      }).join('');
    }).catch(App.showError);
  }

  App.on('bt_xem', 'click', xem);
  App.on('bt_print', 'click', function () { App.print('#bt_area'); });
  App.el('bt_tu').value = App.todayISO();
  App.el('bt_den').value = App.todayISO();
  xem();
})();
