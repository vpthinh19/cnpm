// K_BM2 — Lập phiếu xuất kho (DFD §7.4.3, K_QĐ1). Không xuất quá tồn.
(function () {
  var u = App.guard(['Kho', 'Admin']);
  if (!u) return;

  var nvlItems = []; // [{ label: TenNVL, meta: ĐVT, raw: NVL }]

  function napNVL() {
    return App.api('/kho/nguyen-lieu').then(function (rows) {
      nvlItems = rows.map(function (n) { return { label: n.TenNVL, meta: n.DonViTinh, raw: n }; });
    });
  }

  function themDong() {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="kx-nvl-cell"></td>' +
      '<td class="muted kx-dvt"></td>' +
      '<td class="num kx-ton"></td>' +
      '<td class="center"><input type="number" class="kx-sl" value="1" min="0" step="any" style="width:70px;text-align:center"></td>' +
      '<td class="num"><input type="number" class="kx-dg" value="0" min="0" style="width:110px;text-align:right"></td>' +
      '<td class="num money kx-tt">0</td>' +
      '<td class="center"><button class="btn btn-sm btn-danger kx-del">✕</button></td>';
    App.el('kx_lines').appendChild(tr);
    var cbx = App.combobox({ items: nvlItems, placeholder: 'Gõ tên nguyên liệu...', onChange: function () { capNhatNVL(tr); } });
    tr._cbx = cbx;
    tr.querySelector('.kx-nvl-cell').appendChild(cbx.el);
    tr.querySelector('.kx-sl').addEventListener('input', function () { tinhDong(tr); });
    tr.querySelector('.kx-dg').addEventListener('input', function () { tinhDong(tr); });
    tr.querySelector('.kx-del').addEventListener('click', function () { cbx.destroy(); tr.remove(); tinhTong(); });
  }

  function capNhatNVL(tr) {
    var it = tr._cbx.get();
    var n = it ? it.raw : null;
    tr.querySelector('.kx-dvt').textContent = n ? n.DonViTinh : '';
    var tonCell = tr.querySelector('.kx-ton');
    if (n) {
      tonCell.textContent = App.qty(n.TonHienTai);
      tonCell.style.color = Number(n.TonHienTai) <= Number(n.DinhMucToiThieu) ? 'var(--c-danger)' : '';
    } else {
      tonCell.textContent = ''; tonCell.style.color = '';
    }
    tinhDong(tr);
  }
  function tinhDong(tr) {
    var sl = Number(tr.querySelector('.kx-sl').value) || 0;
    var dg = Number(tr.querySelector('.kx-dg').value) || 0;
    var it = tr._cbx.get();
    var n = it ? it.raw : null;
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
  function xoaTatCaDong() {
    App.el('kx_lines').querySelectorAll('tr').forEach(function (tr) { if (tr._cbx) tr._cbx.destroy(); });
    App.el('kx_lines').innerHTML = '';
  }

  function luu() {
    var rows = App.el('kx_lines').querySelectorAll('tr');
    if (!rows.length) { App.toast('Thêm ít nhất 1 dòng', 'warn'); return; }
    var ChiTiet = [];
    var loiNVL = false, loiSo = false;
    rows.forEach(function (tr) {
      var it = tr._cbx.get();
      var SoLuong = Number(tr.querySelector('.kx-sl').value);
      var DonGia = Number(tr.querySelector('.kx-dg').value);
      if (!it) { loiNVL = true; return; }
      if (!(SoLuong > 0) || !(DonGia > 0)) loiSo = true;
      ChiTiet.push({ NguyenLieuID: it.raw.NguyenLieuID, SoLuong: SoLuong, DonGia: DonGia });
    });
    if (loiNVL) { App.toast('Chọn nguyên liệu hợp lệ từ danh sách', 'warn'); return; }
    if (loiSo) { App.toast('Số lượng và đơn giá phải > 0', 'warn'); return; }
    var body = { NgayXuat: App.el('kx_ngay').value, GhiChu: App.el('kx_ghichu').value.trim(), ChiTiet: ChiTiet };
    App.api('/kho/xuat', { method: 'POST', body: body }).then(function (p) {
      App.toast('Đã lưu phiếu xuất ' + p.MaPhieuXuat);
      var cb = App.el('kx_canhbao');
      if (p.CanhBao && p.CanhBao.length) {
        cb.style.display = 'block';
        cb.style.color = 'var(--c-danger)';
        cb.textContent = '⚠ Cảnh báo tồn ≤ định mức: ' + p.CanhBao.map(function (c) { return c.TenNVL + ' (' + App.qty(c.TonHienTai) + ' ' + c.DonViTinh + ')'; }).join(', ');
      } else { cb.style.display = 'none'; }
      xoaTatCaDong(); napNVL().then(function () { themDong(); tinhTong(); });
    }).catch(App.showError);
  }

  App.on('kx_add', 'click', themDong);
  App.on('kx_save', 'click', luu);
  App.el('kx_ngay').value = App.todayISO();
  napNVL().then(function () { themDong(); });
})();
