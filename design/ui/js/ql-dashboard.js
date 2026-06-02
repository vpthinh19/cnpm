// QL_BM4 — Báo cáo tổng hợp / Dashboard (DFD §7.5.4). Chỉ đọc.
(function () {
  var u = App.guard(['Admin']);
  if (!u) return;

  function xem() {
    var TuNgay = App.el('dash_tu').value, DenNgay = App.el('dash_den').value;
    if (!TuNgay || !DenNgay) { App.toast('Chọn khoảng ngày', 'warn'); return; }
    App.api('/bao-cao/tong-hop', { query: { TuNgay: TuNgay, DenNgay: DenNgay } }).then(function (d) {
      // A
      App.el('dash_tongA').textContent = 'Tổng kỳ: ' + App.money(d.DoanhThu.TongDoanhThuKy) + ' đ';
      var a = App.el('dash_a');
      a.innerHTML = d.DoanhThu.TheoNgay.length
        ? d.DoanhThu.TheoNgay.map(function (r) {
            return '<tr><td>' + App.dateVN(r.Ngay) + '</td><td class="num">' + r.SoHoaDon + '</td><td class="num money">' + App.money(r.Tong) +
              '</td><td class="num money">' + App.money(r.TienMat) + '</td><td class="num money">' + App.money(r.ChuyenKhoan) + '</td></tr>';
          }).join('')
        : '<tr><td colspan="5" class="muted">Không có doanh thu trong kỳ.</td></tr>';
      // B
      var b = App.el('dash_b');
      b.innerHTML = d.TopMon.length
        ? d.TopMon.map(function (m, i) {
            return '<tr><td>' + (i + 1) + '</td><td>' + App.escapeHtml(m.TenMon) + '</td><td class="num">' + m.SoLuongBan + '</td><td class="num money">' + App.money(m.DoanhThu) + '</td></tr>';
          }).join('')
        : '<tr><td colspan="4" class="muted">Chưa có dữ liệu bán hàng.</td></tr>';
      // C
      var c = App.el('dash_c');
      c.innerHTML = d.CanhBaoTon.length
        ? d.CanhBaoTon.map(function (n) {
            return '<tr><td>' + App.escapeHtml(n.TenNVL) + '</td><td>' + App.escapeHtml(n.DonViTinh) +
              '</td><td class="num" style="color:var(--c-danger)">' + App.qty(n.TonHienTai) + '</td><td class="num">' + App.qty(n.DinhMucToiThieu) + '</td></tr>';
          }).join('')
        : '<tr><td colspan="4" class="muted">Không có cảnh báo tồn.</td></tr>';
    }).catch(App.showError);
  }

  App.on('dash_xem', 'click', xem);
  App.on('dash_print', 'click', function () { App.print('#dash_area'); });
  App.el('dash_tu').value = App.todayISO();
  App.el('dash_den').value = App.todayISO();
  xem();
})();
