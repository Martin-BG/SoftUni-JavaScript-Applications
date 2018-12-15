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
  this.get('#/flight/add', flight.addGet);
  this.post('#/flight/add', flight.addPost);
});

$(function () {
  app.run('#/');
});
