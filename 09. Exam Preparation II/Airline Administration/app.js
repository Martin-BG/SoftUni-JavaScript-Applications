const app = Sammy('#container', function () {
  this.use('Handlebars', 'hbs');
  this.before({except: {}}, function () {
    user.initializeLogin();
  });

  this.get('#/', home.index);
  this.get('#/login', user.getLogin);
  this.post('#/login', user.postLogin);
  this.get('#/logout', user.logout);
  this.get('#/register', user.getRegister);
  this.post('#/register', user.postRegister);
});

$(function () {
  app.run('#/');
});
