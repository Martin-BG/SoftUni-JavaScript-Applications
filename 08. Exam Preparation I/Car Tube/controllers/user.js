/**
 * User controller
 * @class
 *
 * @param {UserModel} userModel
 * @param {UserStorage} userStorage
 * @param {Notification} notification
 */

export default function User(userModel, userStorage, notification) {

  const validateCredentials = (username, password, repeatPass) => {
    if (!/^[A-Za-z]{3,}$/.test(username)) {
      notification.error('Username should contain only latin letters and be at least 3 characters long!');
      return false;
    }
    if (!/^[A-Za-z0-9]{6,}$/.test(password)) {
      notification.error('Password should contain only latin letters and digits and be at least 6 characters long!');
      return false;
    }
    if (repeatPass && password !== repeatPass) {
      notification.error('Passwords do not match!');
      return false;
    }
    return true;
  };

  this.getLogin = (ctx) => {
    ctx.partial('views/user/login.hbs');
  };

  this.postLogin = (ctx) => {
    const username = ctx.params.username;
    const password = ctx.params.password;
    if (validateCredentials(username, password)) {
      userModel
        .login(username, password)
        .done((data) => {
          userStorage.save(data);
          notification.info('Login successful.');
          ctx.redirect('#/cars/all');
        })
        .fail(notification.handleError);
    }
  };

  this.logout = (ctx) => {
    userModel
      .logout({authtoken: userStorage.authToken()})
      .done(() => {
        userStorage.clear();
        notification.info('Logout successful.');
        ctx.redirect('#/login');
      })
      .fail(notification.handleError);
  };

  this.getRegister = (ctx) => {
    ctx.partial('views/user/register.hbs');
  };

  this.postRegister = (ctx) => {
    const username = ctx.params.username;
    const password = ctx.params.password;
    const repeatPass = ctx.params.repeatPass;
    if (validateCredentials(username, password, repeatPass)) {
      userModel
        .register({username, password})
        .done((data) => {
          userStorage.save(data);
          notification.info('User registration successful.');
          ctx.redirect('#/cars/all');
        })
        .fail(notification.handleError);
    }
  };
}
