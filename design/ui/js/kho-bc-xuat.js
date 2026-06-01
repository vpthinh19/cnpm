// K_BM5 — Báo cáo xuất kho (DFD §7.4.5). Chỉ đọc.
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  function xem() {
    var TuNgay = App.el('bx_tu').value, DenNgay = App.el('bx_den').value;
    if (!TuNgay || !DenNgay) { App.toast('Chọn khoảng ngày', 'warn'); return; }
    App.api('/kho/bao-cao/xuat', { query: { TuNgay: TuNgay, DenNgay: DenNgay } }).then(function (r) {
      App.el('bx_range').textContent = 'Xuất kho — ' + App.dateVN(TuNgay) + ' đến ' + App.dateVN(DenNgay);
      var tb = App.el('bx_list');
      if (!r.DanhSach.length) { tb.innerHTML = '<tr><td colspan="5" class="muted">Không có dữ liệu.</td></tr>'; }
      else {
        tb.innerHTML = r.DanhSach.map(function (x, i) {
          return '<tr><td>' + (i + 1) + '</td><td>' + App.escapeHtml(x.TenNVL) + '</td><td>' + App.escapeHtml(x.DonViTinh) +
            '</td><td class="num">' + App.qty(x.TongSoLuong) + '</td><td class="num money">' + App.money(x.TongGiaTri) + '</td></tr>';
        }).join('');
      }
      App.el('bx_tong').textContent = App.money(r.TongGiaTri);
    }).catch(App.showError);
  }

  App.on('bx_xem', 'click', xem);
  App.on('bx_print', 'click', function () { window.print(); });
  App.el('bx_tu').value = App.todayISO();
  App.el('bx_den').value = App.todayISO();
  xem();
})();
