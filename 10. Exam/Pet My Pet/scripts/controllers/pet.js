const pet = (() => {

  const others = (ctx) => {
    petModel
      .others(ctx.id)
      .done((pets) => {
        ctx.pets = pets;
        ctx.loadPartials({
          header: './templates/common/header.hbs',
          footer: './templates/common/footer.hbs',
          section: './templates/pet/dashboard.hbs'
        }).then(function () {
          ctx.partials = this.partials;
          ctx.partial('./templates/common/main.hbs');
        });
      })
      .fail(notification.handleError);
  };

  const mine = (ctx) => {
    const id = ctx.params.id;
    petModel
      .mine(id)
      .done((pets) => {
        ctx.pets = pets;
        ctx.loadPartials({
          header: './templates/common/header.hbs',
          footer: './templates/common/footer.hbs',
          section: './templates/pet/my-pets.hbs'
        }).then(function () {
          ctx.partials = this.partials;
          ctx.partial('./templates/common/main.hbs');
        });
      })
      .fail(notification.handleError);
  };

  const category = (ctx) => {
    const category = ctx.params.category;
    petModel
      .category(category)
      .done((pets) => {
        ctx.pets = pets.filter(pet => pet._acl.creator !== ctx.id); // TODO - List only other people's pets - correct???
        ctx.loadPartials({
          header: './templates/common/header.hbs',
          footer: './templates/common/footer.hbs',
          section: './templates/pet/dashboard.hbs'
        }).then(function () {
          ctx.partials = this.partials;
          ctx.partial('./templates/common/main.hbs');
        });
      })
      .fail(notification.handleError);
  };

  return {
    others,
    mine,
    category
  };
})();
