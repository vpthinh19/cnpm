// PV_BM2 — Ghi nhận gọi món (DFD §7.1.2) + chốt order (§7.1.3).
(function () {
  var u = App.guard(['PhucVu', 'Admin']);
  if (!u) return;

  var banMap = {};
  var order = null; // order đang phục vụ của bàn đang chọn

  function napBan() {
    return App.api('/ban').then(function (rows) {
      var sel = App.el('gm_ban');
      sel.innerHTML = '';
      rows.forEach(function (b) {
        banMap[b.BanID] = b.MaBan;
        if (b.TrangThai === 'Trong' || b.TrangThai === 'CoKhach') {
          var o = document.createElement('option');
          o.value = b.BanID;
          o.textContent = b.MaBan + ' — ' + b.KhuVuc;
          sel.appendChild(o);
        }
      });
    });
  }

  function napMenu() {
    return App.api('/mon-an', { query: { TrangThai: 'ConHang', LoaiMon: App.el('gm_loai').value, q: App.el('gm_search').value.trim() } })
      .then(function (rows) {
        var tb = App.el('gm_menu');
        if (!rows.length) { tb.innerHTML = '<tr><td colspan="4" class="muted">Không có món.</td></tr>'; return; }
        tb.innerHTML = rows.map(function (m) {
          return '<tr>' +
            '<td>' + App.escapeHtml(m.TenMon) + '</td>' +
            '<td class="center"><span class="tag-loai">' + (m.LoaiMon === 'MonAn' ? 'Món ăn' : 'Đồ uống') + '</span></td>' +
            '<td class="num money">' + App.money(m.DonGia) + '</td>' +
            '<td class="center"><button class="btn btn-sm btn-primary" data-add="' + m.MonAnID + '">+</button></td>' +
            '</tr>';
        }).join('');
        tb.querySelectorAll('[data-add]').forEach(function (b) {
          b.addEventListener('click', function () { themMon(Number(b.getAttribute('data-add'))); });
        });
      });
  }

  function taiOrderTheoBan() {
    var BanID = App.el('gm_ban').value;
    if (!BanID) { order = null; render(); return Promise.resolve(); }
    return App.api('/order/dang-phuc-vu/' + BanID)
      .then(function (o) { order = o; render(); })
      .catch(function (err) {
        if (err.status === 404) { order = null; render(); }
        else App.showError(err);
      });
  }

  function themMon(MonAnID) {
    var BanID = Number(App.el('gm_ban').value);
    if (!BanID) { App.toast('Chọn bàn trước', 'warn'); return; }
    var p;
    if (!order) p = App.api('/order', { method: 'POST', body: { BanID: BanID, ChiTiet: [{ MonAnID: MonAnID, SoLuong: 1 }] } });
    else p = App.api('/order/' + order.PhieuOrderID + '/dong', { method: 'POST', body: { ChiTiet: [{ MonAnID: MonAnID, SoLuong: 1 }] } });
    p.then(function (o) { order = o; render(); App.toast('Đã thêm món'); }).catch(App.showError);
  }

  function suaDong(soDong, soLuong) {
    App.api('/order/' + order.PhieuOrderID + '/dong/' + soDong, { method: 'PUT', body: { SoLuong: soLuong } })
      .then(function (o) { order = o; render(); }).catch(function (e) { App.showError(e); taiOrderTheoBan(); });
  }
  function xoaDong(soDong) {
    App.api('/order/' + order.PhieuOrderID + '/dong/' + soDong, { method: 'DELETE' })
      .then(function (o) { order = o; render(); App.toast('Đã xóa dòng'); }).catch(App.showError);
  }
  function chot() {
    if (!order) { App.toast('Chưa có order', 'warn'); return; }
    App.api('/order/' + order.PhieuOrderID + '/chot', { method: 'POST' })
      .then(function (r) {
        App.toast('Đã chốt: ' + r.SoMonVaoBep + ' món vào bếp, ' + r.SoDoUongDaPhucVu + ' đồ uống phục vụ');
        taiOrderTheoBan();
      }).catch(App.showError);
  }

  function render() {
    var title = App.el('gm_ordertitle');
    var badge = App.el('gm_orderbadge');
    var ma = App.el('gm_orderma');
    var tb = App.el('gm_order');
    var maBan = banMap[App.el('gm_ban').value] || '';
    title.textContent = 'Order — Bàn ' + maBan;

    if (!order) {
      badge.innerHTML = '<span class="badge gray">Chưa có order</span>';
      ma.value = '—';
      tb.innerHTML = '<tr><td colspan="5" class="muted">Chọn món bên trái để mở order mới.</td></tr>';
      App.el('gm_total').textContent = '0';
      return;
    }
    badge.innerHTML = App.badge(order.TrangThai);
    ma.value = '#' + order.PhieuOrderID;
    var lines = order.ChiTiet || [];
    if (!lines.length) { tb.innerHTML = '<tr><td colspan="5" class="muted">Order trống.</td></tr>'; }
    else {
      tb.innerHTML = lines.map(function (d) {
        var ghi = d.GhiChu ? '<div class="muted" style="font-size:12px">' + App.escapeHtml(d.GhiChu) + '</div>' : '';
        if (d.TrangThai === 'ChuaChot') {
          return '<tr>' +
            '<td>' + App.escapeHtml(d.TenMon) + ghi + '</td>' +
            '<td class="center"><input type="number" value="' + d.SoLuong + '" min="1" data-qty="' + d.SoDong + '" style="width:56px;text-align:center"></td>' +
            '<td class="num money">' + App.money(d.ThanhTien) + '</td>' +
            '<td class="center">' + App.badge(d.TrangThai) + '</td>' +
            '<td class="center"><button class="btn btn-sm btn-danger" data-del="' + d.SoDong + '" title="Xóa dòng">✕</button></td>' +
            '</tr>';
        }
        return '<tr>' +
          '<td>' + App.escapeHtml(d.TenMon) + ghi + '</td>' +
          '<td class="center">' + d.SoLuong + '</td>' +
          '<td class="num money">' + App.money(d.ThanhTien) + '</td>' +
          '<td class="center">' + App.badge(d.TrangThai) + '</td>' +
          '<td class="center muted" title="Đã chốt — không sửa/xóa">🔒</td>' +
          '</tr>';
      }).join('');
      tb.querySelectorAll('[data-qty]').forEach(function (inp) {
        inp.addEventListener('change', function () {
          var sl = Number(inp.value);
          if (sl >= 1) suaDong(Number(inp.getAttribute('data-qty')), sl);
        });
      });
      tb.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () { xoaDong(Number(b.getAttribute('data-del'))); });
      });
    }
    App.el('gm_total').textContent = App.money(order.TongTamTinh);
  }

  App.on('gm_ban', 'change', taiOrderTheoBan);
  App.on('gm_loai', 'change', napMenu);
  App.on('gm_search', 'input', napMenu);
  App.on('gm_chot', 'click', chot);

  napBan().then(function () { napMenu(); taiOrderTheoBan(); });
})();
