// PV_BM1 — Tiếp nhận đặt bàn (DFD §7.1.1).
(function () {
  var u = App.guard(['PhucVu', 'Admin']);
  if (!u) return;

  var banMap = {}; // BanID -> MaBan (để hiển thị)

  function napBan() {
    return App.api('/ban').then(function (rows) {
      var sel = App.el('db_ban');
      sel.innerHTML = '';
      rows.forEach(function (b) {
        banMap[b.BanID] = b.MaBan;
        if (b.TrangThai === 'Trong') {
          var o = document.createElement('option');
          o.value = b.BanID;
          o.textContent = b.MaBan + ' — ' + b.KhuVuc + ' (' + b.SucChua + ' chỗ)';
          sel.appendChild(o);
        }
      });
      if (!sel.options.length) sel.innerHTML = '<option value="">(Không còn bàn trống)</option>';
    });
  }

  function napDanhSach() {
    var q = App.el('db_search').value.trim();
    return App.api('/dat-ban', { query: { q: q } }).then(function (rows) {
      var tb = App.el('db_list');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="6" class="muted">Chưa có phiếu đặt bàn.</td></tr>'; return; }
      tb.innerHTML = rows.map(function (p) {
        var thaoTac = '<td class="muted">—</td>';
        if (p.TrangThai === 'DaDat') {
          thaoTac = '<td><div class="btn-row">' +
            '<button class="btn btn-sm btn-success" data-nhan="' + p.PhieuDatBanID + '">Nhận bàn</button>' +
            '<button class="btn btn-sm btn-danger" data-huy="' + p.PhieuDatBanID + '">Hủy</button></div></td>';
        }
        return '<tr>' +
          '<td>#' + p.PhieuDatBanID + '</td>' +
          '<td>' + App.escapeHtml(p.TenKhach) + '<div class="muted" style="font-size:12px">' + App.escapeHtml(p.SoDienThoai) + '</div></td>' +
          '<td>' + App.escapeHtml(banMap[p.BanID] || p.BanID) + '</td>' +
          '<td>' + App.timeShort(p.ThoiGianDat) + '</td>' +
          '<td>' + App.badge(p.TrangThai) + '</td>' +
          thaoTac + '</tr>';
      }).join('');

      tb.querySelectorAll('[data-nhan]').forEach(function (b) {
        b.addEventListener('click', function () { thaoTac('/dat-ban/' + b.getAttribute('data-nhan') + '/nhan-ban', 'Đã nhận bàn'); });
      });
      tb.querySelectorAll('[data-huy]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (confirm('Hủy phiếu đặt bàn này?')) thaoTac('/dat-ban/' + b.getAttribute('data-huy') + '/huy', 'Đã hủy phiếu');
        });
      });
    });
  }

  function thaoTac(path, msg) {
    App.api(path, { method: 'POST' })
      .then(function () { App.toast(msg); lamMoi(); })
      .catch(App.showError);
  }

  function luuPhieu() {
    var BanID = App.el('db_ban').value;
    if (!BanID) { App.toast('Không còn bàn trống', 'warn'); return; }
    var body = {
      BanID: Number(BanID),
      TenKhach: App.el('db_ten').value.trim(),
      SoDienThoai: App.el('db_sdt').value.trim(),
      SoNguoi: Number(App.el('db_songuoi').value),
      ThoiGianDat: App.el('db_thoigian').value,
      HinhThucDat: App.el('db_hinhthuc').value,
      GhiChu: App.el('db_ghichu').value.trim(),
    };
    App.api('/dat-ban', { method: 'POST', body: body })
      .then(function () {
        App.toast('Đã tiếp nhận đặt bàn');
        App.el('db_ten').value = ''; App.el('db_sdt').value = ''; App.el('db_ghichu').value = '';
        lamMoi();
      })
      .catch(App.showError);
  }

  function lamMoi() { napBan().then(napDanhSach); }

  App.on('db_luu', 'click', luuPhieu);
  App.on('db_search', 'input', napDanhSach);
  // Mặc định thời gian đặt = bây giờ.
  (function () {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    App.el('db_thoigian').value = d.toISOString().slice(0, 16);
  })();
  lamMoi();
})();
