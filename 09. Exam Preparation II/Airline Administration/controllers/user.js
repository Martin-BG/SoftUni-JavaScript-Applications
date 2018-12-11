const user = (function () {
  const getLogin = function (ctx) {
    ctx.partial('views/user/login.hbs');
  };

  const postLogin = function (ctx) {
    const username = ctx.params.username;
    const password = ctx.params.password;

    userModel.login(username, password).done(function (data) {
      storage.saveUser(data);

      ctx.redirect('#/');
    });
  };

  const logout = function (ctx) {
    userModel.logout().done(function () {
      storage.deleteUser();

      ctx.redirect('#/');
    });
  };

  const getRegister = function (ctx) {
    ctx.partial('views/user/register.hbs');
  };

  const postRegister = function (ctx) {
    userModel.register(ctx.params).done(function (data) {
      storage.saveUser(data);

      ctx.redirect('#/');
    });
  };

  const initializeLogin = function () {
    if (userModel.isAuthorized()) {

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
