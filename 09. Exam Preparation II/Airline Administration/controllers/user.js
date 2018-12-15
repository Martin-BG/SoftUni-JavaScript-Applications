const user = (function () {
  const getLogin = function (ctx) {
    ctx.partial('views/user/login.hbs');
  };

  const postLogin = function (ctx) {
    const username = ctx.params.username;
    const password = ctx.params.password;

    userModel.login(username, password).done(function (data) {
      storage.saveUser(data);

      notification.info('Login successful');

      ctx.redirect('#/');
    });
  };

  const logout = function (ctx) {
    userModel.logout().done(function () {
      storage.deleteUser();

      notification.info('Logout successful');

      ctx.redirect('#/');
    });
  };

  const getRegister = function (ctx) {
    ctx.partial('views/user/register.hbs');
  };

  const postRegister = function (ctx) {
    userModel.register(ctx.params).done(function (data) {
      storage.saveUser(data);

      notification.info('Registration successful');

      ctx.redirect('#/');
    }).fail(() => {
      notification.error('Registration failed!');
    });
  };

  const initializeLogin = function () {
    if (userModel.isAuthorized()) {
      const userInfo = storage.getData('userInfo');
      $('#loggedUserName').text(userInfo.username);
      $('#right-container').show();
      $('.hidden-for-logged-user').hide();
    } else {
      $('#loggedUserName').text('');
      $('#right-container').hide();
      $('.hidden-for-logged-user').show();
    }
  };

  return {
    getLogin,
    postLogin,
    logout,
    getRegister,
    postRegister,
    initializeLogin
  };
}());
