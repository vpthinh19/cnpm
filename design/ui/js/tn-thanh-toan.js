// TN_BM2 — Xử lý thanh toán (DFD §7.2.1, TN_QĐ1).
(function () {
  var u = App.guard(['ThuNgan', 'Admin']);
  if (!u) return;

  var banMap = {};
  var preview = null; // kết quả xem-trước hiện tại

  function napOrders() {
    return App.api('/ban').then(function (bans) {
      bans.forEach(function (b) { banMap[b.BanID] = b.MaBan; });
      return App.api('/order', { query: { TrangThai: 'DangPhucVu' } });
    }).then(function (orders) {
      var sel = App.el('tt_order');
      if (!orders.length) { sel.innerHTML = '<option value="">(Không có order)</option>'; xoa(); return; }
      sel.innerHTML = orders.map(function (o) {
        return '<option value="' + o.PhieuOrderID + '">#' + o.PhieuOrderID + ' — Bàn ' + (banMap[o.BanID] || o.BanID) + '</option>';
      }).join('');
      xemTruoc();
    });
  }

  function xoa() {
    preview = null;
    App.el('tt_lines').innerHTML = '<tr><td colspan="4" class="muted">Chọn order để thanh toán.</td></tr>';
    App.el('tt_tongmon').textContent = '0'; App.el('tt_vat').textContent = '0'; App.el('tt_tong').textContent = '0';
    App.el('tt_status').innerHTML = '';
    App.el('tt_confirm').disabled = true;
  }

  function xemTruoc() {
    var id = App.el('tt_order').value;
    if (!id) { xoa(); return; }
    App.api('/thanh-toan/xem-truoc/' + id).then(function (p) {
      preview = p;
      App.el('tt_status').innerHTML = '<span class="badge green">Đủ điều kiện thanh toán</span>';
      App.el('tt_lines').innerHTML = (p.ChiTiet || []).map(function (d) {
        return '<tr><td>' + App.escapeHtml(d.TenMon) + '</td><td class="center">' + d.SoLuong +
          '</td><td class="num money">' + App.money(d.DonGia) + '</td><td class="num money">' + App.money(d.ThanhTien) + '</td></tr>';
      }).join('');
      App.el('tt_tongmon').textContent = App.money(p.TongTienMon);
      App.el('tt_vat').textContent = App.money(p.TienVat);
      App.el('tt_tong').textContent = App.money(p.TongThanhToan);
      App.el('tt_confirm').disabled = false;
      tinhThua();
    }).catch(function (err) {
      preview = null;
      App.el('tt_status').innerHTML = '<span class="badge red">' + App.escapeHtml(err.message || 'Chưa đủ điều kiện') + '</span>';
      App.el('tt_lines').innerHTML = '<tr><td colspan="4" class="muted">' + App.escapeHtml(err.message || '') + '</td></tr>';
      App.el('tt_tongmon').textContent = '0'; App.el('tt_vat').textContent = '0'; App.el('tt_tong').textContent = '0';
      App.el('tt_confirm').disabled = true;
    });
  }

  function hinhThuc() {
    var r = document.querySelector('input[name="httt"]:checked');
    return r ? r.value : 'TienMat';
  }
  function tinhThua() {
    if (!preview) { App.el('tt_thua').value = 0; return; }
    var dua = Number(App.el('tt_khachdua').value) || 0;
    var thua = dua - preview.TongThanhToan;
    App.el('tt_thua').value = thua > 0 ? thua : 0;
  }
  function capNhatHinhThuc() {
    var ht = hinhThuc();
    var tienMat = ht === 'TienMat';
    App.el('tt_khachdua').disabled = !tienMat;
    App.el('tt_magd_wrap').style.display = tienMat ? 'none' : 'block';
    tinhThua();
  }

  function thanhToan() {
    if (!preview) return;
    var ht = hinhThuc();
    var body = { PhieuOrderID: preview.PhieuOrderID, HinhThucTT: ht };
    if (ht === 'TienMat') {
      body.TienKhachDua = Number(App.el('tt_khachdua').value) || 0;
      if (body.TienKhachDua < preview.TongThanhToan) { App.toast('Tiền khách đưa không đủ', 'warn'); return; }
    } else {
      body.MaGiaoDich = App.el('tt_magd').value.trim() || null;
    }
    App.el('tt_confirm').disabled = true;
    App.api('/thanh-toan', { method: 'POST', body: body }).then(function (kq) {
      App.toast('Thanh toán thành công — ' + kq.HoaDon.MaHoaDon);
      App.el('tt_khachdua').value = '';
      napOrders();
    }).catch(function (e) { App.showError(e); App.el('tt_confirm').disabled = false; });
  }

  App.on('tt_order', 'change', xemTruoc);
  App.on('tt_khachdua', 'input', tinhThua);
  App.on('tt_confirm', 'click', thanhToan);
  document.querySelectorAll('input[name="httt"]').forEach(function (r) { r.addEventListener('change', capNhatHinhThuc); });

  capNhatHinhThuc();
  napOrders();
})();
