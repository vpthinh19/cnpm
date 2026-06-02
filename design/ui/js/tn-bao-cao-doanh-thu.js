// TN_BM1 — Báo cáo doanh thu (DFD §7.2.2). Chỉ đọc.
(function () {
  var u = App.guard(['ThuNgan', 'Admin']);
  if (!u) return;

  var HT = { TienMat: 'Tiền mặt', ChuyenKhoan: 'Chuyển khoản' };

  function xem() {
    var TuNgay = App.el('dt_tu').value;
    var DenNgay = App.el('dt_den').value;
    if (!TuNgay || !DenNgay) { App.toast('Chọn khoảng ngày', 'warn'); return; }
    App.api('/bao-cao/doanh-thu', { query: { TuNgay: TuNgay, DenNgay: DenNgay } }).then(function (r) {
      App.el('dt_range').textContent = 'Kết quả — ' + App.dateVN(TuNgay) + ' đến ' + App.dateVN(DenNgay);
      var tb = App.el('dt_list');
      if (!r.DanhSach.length) { tb.innerHTML = '<tr><td colspan="6" class="muted">Không có hóa đơn trong kỳ.</td></tr>'; }
      else {
        tb.innerHTML = r.DanhSach.map(function (h, i) {
          return '<tr><td>' + (i + 1) + '</td><td>' + App.escapeHtml(h.MaHoaDon) + '</td><td>' + App.dateVN(h.ThoiGianTao) +
            '</td><td>' + App.escapeHtml(h.MaBanSnapshot) + '</td><td class="num money">' + App.money(h.TongThanhToan) +
            '</td><td>' + (HT[h.HinhThucTT] || h.HinhThucTT) + '</td></tr>';
        }).join('');
      }
      App.el('dt_tong').textContent = App.money(r.TongDoanhThu);
    }).catch(App.showError);
  }

  App.on('dt_xem', 'click', xem);
  App.on('dt_print', 'click', function () { App.print('#dt_area'); });
  App.el('dt_tu').value = App.todayISO();
  App.el('dt_den').value = App.todayISO();
  xem();
})();
