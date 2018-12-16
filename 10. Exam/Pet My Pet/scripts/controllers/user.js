const user = (() => {

  const validateCredentials = (username, password) => {
    if (username.length < 3) {
      notification.error('Username must be at least 3 symbols!');
      return false;
    }
    if (password.length < 6) {
      notification.error('Password must be at least 6 symbols!');
      return false;
    }
    return true;
  };

  const getLogin = (ctx) => {
    ctx.loadPartials({
      header: './templates/common/header.hbs',
      footer: './templates/common/footer.hbs',
      section: './templates/user/login.hbs'
    }).then(function () {
      ctx.partials = this.partials;
      ctx.partial('./templates/common/main.hbs');
    });
  };

  const getRegister = (ctx) => {
    ctx.loadPartials({
      header: './templates/common/header.hbs',
      footer: './templates/common/footer.hbs',
      section: './templates/user/register.hbs'
    }).then(function () {
      ctx.partials = this.partials;
      ctx.partial('./templates/common/main.hbs');
    });
  };

  const postLogin = (ctx) => {
    const username = ctx.params.username;
    const password = ctx.params.password;
    if (validateCredentials(username, password)) {
      userModel
        .login(username, password)
        .done((data) => {
          storage.saveUser(data);
          notification.info('Login successful.');
          ctx.redirect('#/');
        })
        .fail(notification.handleError);
    }
  };

  const logout = (ctx) => {
    userModel
      .logout({authtoken: storage.authToken()})
      .done(() => {
        storage.clearUser();
        notification.info('Logout successful.');
        ctx.redirect('#/');
      })
      .fail(notification.handleError);
  };

  const postRegister = (ctx) => {
    const username = ctx.params.username;
    const password = ctx.params.password;
    if (validateCredentials(username, password)) {
      userModel
        .register({username, password})
        .done((data) => {
          storage.saveUser(data);
          notification.info('User registration successful.');
          ctx.redirect('#/');
        })
        .fail(notification.handleError);
    }
  };

  return {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    logout
  };
})();
