// K_BM2 — Lập phiếu xuất kho (DFD §7.4.3, K_QĐ1). Không xuất quá tồn.
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  var nvlList = [];
  var nvlMap = {};

  function nvlOptions() {
    return nvlList.map(function (n) { return '<option value="' + n.NguyenLieuID + '">' + App.escapeHtml(n.TenNVL) + '</option>'; }).join('');
  }
  function napNVL() {
    return App.api('/kho/nguyen-lieu').then(function (rows) {
      nvlList = rows; nvlMap = {};
      rows.forEach(function (n) { nvlMap[n.NguyenLieuID] = n; });
    });
  }

  function themDong() {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><select class="kx-nvl">' + nvlOptions() + '</select></td>' +
      '<td class="muted kx-dvt"></td>' +
      '<td class="num kx-ton"></td>' +
      '<td class="center"><input type="number" class="kx-sl" value="1" min="0" step="any" style="width:70px;text-align:center"></td>' +
      '<td class="num"><input type="number" class="kx-dg" value="0" min="0" style="width:110px;text-align:right"></td>' +
      '<td class="num money kx-tt">0</td>' +
      '<td class="center"><button class="btn btn-sm btn-danger kx-del">✕</button></td>';
    App.el('kx_lines').appendChild(tr);
    capNhatNVL(tr);
    tr.querySelector('.kx-nvl').addEventListener('change', function () { capNhatNVL(tr); });
    tr.querySelector('.kx-sl').addEventListener('input', function () { tinhDong(tr); });
    tr.querySelector('.kx-dg').addEventListener('input', function () { tinhDong(tr); });
    tr.querySelector('.kx-del').addEventListener('click', function () { tr.remove(); tinhTong(); });
  }

  function capNhatNVL(tr) {
    var n = nvlMap[tr.querySelector('.kx-nvl').value];
    tr.querySelector('.kx-dvt').textContent = n ? n.DonViTinh : '';
    var tonCell = tr.querySelector('.kx-ton');
    if (n) {
      tonCell.textContent = App.qty(n.TonHienTai);
      tonCell.style.color = Number(n.TonHienTai) <= Number(n.DinhMucToiThieu) ? 'var(--c-danger)' : '';
    }
    tinhDong(tr);
  }
  function tinhDong(tr) {
    var sl = Number(tr.querySelector('.kx-sl').value) || 0;
    var dg = Number(tr.querySelector('.kx-dg').value) || 0;
    var n = nvlMap[tr.querySelector('.kx-nvl').value];
    var slInput = tr.querySelector('.kx-sl');
    slInput.style.color = (n && sl > Number(n.TonHienTai)) ? 'var(--c-danger)' : '';
    tr.querySelector('.kx-tt').textContent = App.money(sl * dg);
    tinhTong();
  }
  function tinhTong() {
    var tong = 0;
    App.el('kx_lines').querySelectorAll('tr').forEach(function (tr) {
      tong += (Number(tr.querySelector('.kx-sl').value) || 0) * (Number(tr.querySelector('.kx-dg').value) || 0);
    });
    App.el('kx_total').textContent = App.money(tong);
  }

  function luu() {
    var rows = App.el('kx_lines').querySelectorAll('tr');
    if (!rows.length) { App.toast('Thêm ít nhất 1 dòng', 'warn'); return; }
    var ChiTiet = [];
    var loi = false;
    rows.forEach(function (tr) {
      var SoLuong = Number(tr.querySelector('.kx-sl').value);
      var DonGia = Number(tr.querySelector('.kx-dg').value);
      if (!(SoLuong > 0) || !(DonGia > 0)) loi = true;
      ChiTiet.push({ NguyenLieuID: Number(tr.querySelector('.kx-nvl').value), SoLuong: SoLuong, DonGia: DonGia });
    });
    if (loi) { App.toast('Số lượng và đơn giá phải > 0', 'warn'); return; }
    var body = { NgayXuat: App.el('kx_ngay').value, GhiChu: App.el('kx_ghichu').value.trim(), ChiTiet: ChiTiet };
    App.api('/kho/xuat', { method: 'POST', body: body }).then(function (p) {
      App.toast('Đã lưu phiếu xuất ' + p.MaPhieuXuat);
      var cb = App.el('kx_canhbao');
      if (p.CanhBao && p.CanhBao.length) {
        cb.style.display = 'block';
        cb.style.color = 'var(--c-danger)';
        cb.textContent = '⚠ Cảnh báo tồn ≤ định mức: ' + p.CanhBao.map(function (c) { return c.TenNVL + ' (' + App.qty(c.TonHienTai) + ' ' + c.DonViTinh + ')'; }).join(', ');
      } else { cb.style.display = 'none'; }
      App.el('kx_lines').innerHTML = ''; napNVL().then(function () { themDong(); tinhTong(); });
    }).catch(App.showError);
  }

  App.on('kx_add', 'click', themDong);
  App.on('kx_save', 'click', luu);
  App.el('kx_ngay').value = App.todayISO();
  napNVL().then(function () { themDong(); });
})();
