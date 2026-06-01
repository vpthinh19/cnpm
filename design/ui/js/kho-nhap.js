// K_BM1 — Lập phiếu nhập kho (DFD §7.4.1, K_QĐ1).
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  var nvlList = [];

  function nvlOptions() {
    return nvlList.map(function (n) { return '<option value="' + n.NguyenLieuID + '" data-dvt="' + App.escapeHtml(n.DonViTinh) + '">' + App.escapeHtml(n.TenNVL) + '</option>'; }).join('');
  }

  function napNCC() {
    return App.api('/kho/ncc').then(function (rows) {
      App.el('kn_ncc').innerHTML = rows.map(function (n) { return '<option value="' + n.NhaCungCapID + '">' + App.escapeHtml(n.TenNCC) + '</option>'; }).join('')
        || '<option value="">(Chưa có NCC)</option>';
    });
  }
  function napNVL() {
    return App.api('/kho/nguyen-lieu').then(function (rows) { nvlList = rows; });
  }

  function themDong() {
    var tb = App.el('kn_lines');
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><select class="kn-nvl">' + nvlOptions() + '</select></td>' +
      '<td class="muted kn-dvt"></td>' +
      '<td class="center"><input type="number" class="kn-sl" value="1" min="0" step="any" style="width:70px;text-align:center"></td>' +
      '<td class="num"><input type="number" class="kn-dg" value="0" min="0" style="width:110px;text-align:right"></td>' +
      '<td class="num money kn-tt">0</td>' +
      '<td class="center"><button class="btn btn-sm btn-danger kn-del">✕</button></td>';
    tb.appendChild(tr);
    capNhatDVT(tr);
    tr.querySelector('.kn-nvl').addEventListener('change', function () { capNhatDVT(tr); });
    tr.querySelector('.kn-sl').addEventListener('input', function () { tinhDong(tr); });
    tr.querySelector('.kn-dg').addEventListener('input', function () { tinhDong(tr); });
    tr.querySelector('.kn-del').addEventListener('click', function () { tr.remove(); tinhTong(); });
  }

  function capNhatDVT(tr) {
    var opt = tr.querySelector('.kn-nvl').selectedOptions[0];
    tr.querySelector('.kn-dvt').textContent = opt ? opt.getAttribute('data-dvt') : '';
    tinhDong(tr);
  }
  function tinhDong(tr) {
    var sl = Number(tr.querySelector('.kn-sl').value) || 0;
    var dg = Number(tr.querySelector('.kn-dg').value) || 0;
    tr.querySelector('.kn-tt').textContent = App.money(sl * dg);
    tinhTong();
  }
  function tinhTong() {
    var tong = 0;
    App.el('kn_lines').querySelectorAll('tr').forEach(function (tr) {
      tong += (Number(tr.querySelector('.kn-sl').value) || 0) * (Number(tr.querySelector('.kn-dg').value) || 0);
    });
    App.el('kn_total').textContent = App.money(tong);
  }

  function luu() {
    var rows = App.el('kn_lines').querySelectorAll('tr');
    if (!rows.length) { App.toast('Thêm ít nhất 1 dòng', 'warn'); return; }
    var ChiTiet = [];
    var loi = false;
    rows.forEach(function (tr) {
      var NguyenLieuID = Number(tr.querySelector('.kn-nvl').value);
      var SoLuong = Number(tr.querySelector('.kn-sl').value);
      var DonGia = Number(tr.querySelector('.kn-dg').value);
      if (!(SoLuong > 0) || !(DonGia > 0)) loi = true;
      ChiTiet.push({ NguyenLieuID: NguyenLieuID, SoLuong: SoLuong, DonGia: DonGia });
    });
    if (loi) { App.toast('Số lượng và đơn giá phải > 0', 'warn'); return; }
    var body = { NhaCungCapID: Number(App.el('kn_ncc').value), NgayNhap: App.el('kn_ngay').value, GhiChu: App.el('kn_ghichu').value.trim(), ChiTiet: ChiTiet };
    App.api('/kho/nhap', { method: 'POST', body: body }).then(function (p) {
      App.toast('Đã lưu phiếu nhập ' + p.MaPhieuNhap);
      App.el('kn_lines').innerHTML = ''; themDong(); tinhTong();
      napRecent();
    }).catch(App.showError);
  }

  function napRecent() {
    App.api('/kho/nhap').then(function (rows) {
      var tb = App.el('kn_recent');
      if (!rows.length) { tb.innerHTML = '<tr><td colspan="5" class="muted">Chưa có phiếu nhập.</td></tr>'; return; }
      tb.innerHTML = rows.slice(0, 15).map(function (p) {
        return '<tr><td>' + App.escapeHtml(p.MaPhieuNhap) + '</td><td>' + App.dateVN(p.NgayNhap) + '</td><td>' +
          App.escapeHtml(p.NhaCungCapID) + '</td><td class="num money">' + App.money(p.TongGiaTri) +
          '</td><td><button class="btn btn-sm" data-xem="' + p.PhieuNhapKhoID + '">Xem</button></td></tr>';
      }).join('');
      // Hiển thị tên NCC thay vì ID: nạp lại NCC map.
      App.api('/kho/ncc').then(function (nccs) {
        var map = {}; nccs.forEach(function (n) { map[n.NhaCungCapID] = n.TenNCC; });
        tb.querySelectorAll('tr').forEach(function (tr) {
          var cell = tr.children[2];
          if (cell && map[cell.textContent]) cell.textContent = map[cell.textContent];
        });
      });
      tb.querySelectorAll('[data-xem]').forEach(function (b) {
        b.addEventListener('click', function () { xem(b.getAttribute('data-xem')); });
      });
    }).catch(App.showError);
  }

  function xem(id) {
    App.api('/kho/nhap/' + id).then(function (p) {
      var dong = (p.ChiTiet || []).map(function (d) { return '· ' + d.TenNVL + ': ' + App.qty(d.SoLuong) + ' ' + d.DonViTinh + ' × ' + App.money(d.DonGia); }).join('\n');
      alert('Phiếu ' + p.MaPhieuNhap + ' — NCC: ' + (p.TenNCC || '') + '\nNgày: ' + App.dateVN(p.NgayNhap) + '\n\n' + dong + '\n\nTổng: ' + App.money(p.TongGiaTri));
    }).catch(App.showError);
  }

  App.on('kn_add', 'click', themDong);
  App.on('kn_save', 'click', luu);
  App.el('kn_ngay').value = App.todayISO();
  Promise.all([napNCC(), napNVL()]).then(function () { themDong(); napRecent(); });
})();
