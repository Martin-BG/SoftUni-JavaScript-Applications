$(() => {
  (Sammy('#container', function () {
    this.use('Handlebars', 'hbs');

    this.before({except: {}}, (ctx) => {
      const user = storage.getUser();
      ctx.username = user.name;
      ctx.id = user.id;
      ctx.isAuth = !!ctx.id;
      notification.hideError();
    });

    this.get('#/', home.index);
    this.get('#/login', user.getLogin);
    this.post('#/login', user.postLogin);
    this.get('#/logout', user.logout);
    this.get('#/register', user.getRegister);
    this.post('#/register', user.postRegister);

    this.get('#/dashboard', pet.others);
    this.get('#/my-pets/:id', pet.mine);
    this.get('#/pets/:category', pet.category);

    this.get('#/create', pet.getCreate);
    this.post('#/create', pet.postCreate);

    this.get('#/delete/:id', pet.getRemove);
    this.post('#/delete/:id', pet.postRemove);

    this.get('#/details/:id', pet.details);

    this.get('#/like/:id', pet.likePet);

    this.post('#/edit/:id', pet.edit);
  })).run('#/');
});
