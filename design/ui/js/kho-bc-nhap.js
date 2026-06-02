// K_BM4 — Báo cáo nhập kho (DFD §7.4.4). Chỉ đọc.
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  function napNCC() {
    return App.api('/kho/ncc').then(function (rows) {
      var sel = App.el('bn_ncc');
      rows.forEach(function (n) {
        var o = document.createElement('option'); o.value = n.NhaCungCapID; o.textContent = n.TenNCC; sel.appendChild(o);
      });
    });
  }

  function xem() {
    var TuNgay = App.el('bn_tu').value, DenNgay = App.el('bn_den').value;
    if (!TuNgay || !DenNgay) { App.toast('Chọn khoảng ngày', 'warn'); return; }
    App.api('/kho/bao-cao/nhap', { query: { TuNgay: TuNgay, DenNgay: DenNgay, NhaCungCapID: App.el('bn_ncc').value } }).then(function (r) {
      App.el('bn_range').textContent = 'Nhập kho — ' + App.dateVN(TuNgay) + ' đến ' + App.dateVN(DenNgay);
      var tb = App.el('bn_list');
      if (!r.DanhSach.length) { tb.innerHTML = '<tr><td colspan="6" class="muted">Không có dữ liệu.</td></tr>'; }
      else {
        tb.innerHTML = r.DanhSach.map(function (x, i) {
          return '<tr><td>' + (i + 1) + '</td><td>' + App.escapeHtml(x.TenNVL) + '</td><td>' + App.escapeHtml(x.DonViTinh) +
            '</td><td class="num">' + App.qty(x.TongSoLuong) + '</td><td class="num money">' + App.money(x.TongGiaTri) +
            '</td><td>' + App.escapeHtml(x.TenNCC) + '</td></tr>';
        }).join('');
      }
      App.el('bn_tong').textContent = App.money(r.TongGiaTri);
    }).catch(App.showError);
  }

  App.on('bn_xem', 'click', xem);
  App.on('bn_print', 'click', function () { App.print('#bn_area'); });
  App.el('bn_tu').value = App.todayISO();
  App.el('bn_den').value = App.todayISO();
  napNCC().then(xem);
})();
