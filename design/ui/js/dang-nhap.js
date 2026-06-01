// Màn đăng nhập (SYS_BM1) — POST /auth/login (DFD §7.6.1).
(function () {
  // Nếu đã đăng nhập thì vào thẳng trang chủ theo vai trò.
  var u = App.user();
  if (App.token() && u) { location.href = App.ROLE_HOME[u.RoleID] || 'dang-nhap.html'; return; }

  var form = App.el('loginForm');
  var errBox = App.el('loginError');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errBox.style.display = 'none';
    var Username = App.el('username').value.trim();
    var Password = App.el('password').value;
    if (!Username || !Password) {
      errBox.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu';
      errBox.style.display = 'block';
      return;
    }
    App.api('/auth/login', { method: 'POST', body: { Username: Username, Password: Password } })
      .then(function (data) {
        App.setSession(data.token, data.user);
        location.href = App.ROLE_HOME[data.user.RoleID] || 'dang-nhap.html';
      })
      .catch(function (err) {
        errBox.textContent = err.message || 'Đăng nhập thất bại';
        errBox.style.display = 'block';
      });
  });
})();
