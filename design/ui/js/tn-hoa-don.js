// TN_BM3 — Xuất / in lại hóa đơn (DFD §7.2.3).
(function () {
  var u = App.guard(['ThuNgan', 'Admin']);
  if (!u) return;

  var HT = { TienMat: 'Tiền mặt', ChuyenKhoan: 'Chuyển khoản' };

  function napList() {
    var q = App.el('hd_search').value.trim();
    App.api('/hoa-don', { query: { MaHoaDon: q } }).then(function (rows) {
      var tb = App.el('hd_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="5" class="muted">Chưa có hóa đơn.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (h) {
        return '<tr><td>' + App.escapeHtml(h.MaHoaDon) + '</td><td>' + App.escapeHtml(h.MaBanSnapshot) + '</td><td>' +
          App.timeShort(h.ThoiGianTao) + '</td><td class="num money">' + App.money(h.TongThanhToan) +
          '</td><td><button class="btn btn-sm" data-xem="' + h.HoaDonID + '">Xem</button></td></tr>';
      }).join('');
      tb.querySelectorAll('[data-xem]').forEach(function (b) {
        b.addEventListener('click', function () { xem(b.getAttribute('data-xem')); });
      });
      if (rows.length) xem(rows[0].HoaDonID);
    }).catch(App.showError);
  }

  var hoaDonHienTai = null;

  function renderReceipt(hd, chiTiet, nhaHang, banSao) {
    hoaDonHienTai = hd.HoaDonID;
    App.el('hd_copy').style.display = banSao ? 'block' : 'none';
    if (nhaHang) {
      App.el('hd_tenhang').textContent = (nhaHang.ten || 'BÒ NÉ MỸ CẢNH').toUpperCase();
      App.el('hd_nhahang').innerHTML = App.escapeHtml(nhaHang.dia_chi || '') + '<br>ĐT: ' + App.escapeHtml(nhaHang.so_dien_thoai || '') + ' · MST: ' + App.escapeHtml(nhaHang.ma_so_thue || '');
    }
    App.el('hd_so').textContent = hd.MaHoaDon;
    App.el('hd_ban').textContent = hd.MaBanSnapshot;
    App.el('hd_ngay').textContent = App.dateTime(hd.ThoiGianTao);
    App.el('hd_ht').textContent = HT[hd.HinhThucTT] || hd.HinhThucTT;
    App.el('hd_lines').innerHTML = (chiTiet || []).map(function (d) {
      return '<tr><td>' + App.escapeHtml(d.TenMon) + '</td><td style="text-align:center">' + d.SoLuong + '</td><td class="num">' + App.money(d.ThanhTien) + '</td></tr>';
    }).join('');
    App.el('hd_tongmon').textContent = App.money(hd.TongTienMon);
    App.el('hd_vat').textContent = App.money(hd.TienVat);
    App.el('hd_tong').textContent = App.money(hd.TongThanhToan);
  }

  function xem(id) {
    App.api('/hoa-don/' + id).then(function (r) {
      renderReceipt(r.HoaDon, r.ChiTiet, r.NhaHang, r.HoaDon.SoLanIn >= 2);
    }).catch(App.showError);
  }

  function inLai() {
    if (!hoaDonHienTai) return;
    App.api('/hoa-don/' + hoaDonHienTai + '/in', { method: 'POST' }).then(function (r) {
      renderReceipt(r.HoaDon, r.ChiTiet, r.NhaHang, r.BanSao);
      window.print();
    }).catch(App.showError);
  }

  App.on('hd_search', 'input', napList);
  App.on('hd_print', 'click', inLai);
  napList();
})();
