const pet = (() => {

  const parsePet = (ctx) => {
    return {
      name: ctx.params.name.trim(),
      description: ctx.params.description.trim(),
      imageURL: ctx.params.imageURL.trim(),
      category: ctx.params.category,
      likes: 0,
    };
  };

  const validatePet = (pet) => {
    if (!pet.name || !pet.description || !pet.imageURL) {
      notification.error('All input fields are required!');
      return false;
    }
    return true;
  };

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
        ctx.pets = pets.filter(pet => pet._acl.creator !== ctx.id); // TODO - use query selector to Kinvey!!!
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

  const getCreate = (ctx) => {
    ctx.loadPartials({
      header: './templates/common/header.hbs',
      footer: './templates/common/footer.hbs',
      section: './templates/pet/create.hbs'
    }).then(function () {
      ctx.partials = this.partials;
      ctx.partial('./templates/common/main.hbs');
    });
  };

  const postCreate = (ctx) => {
    const pet = parsePet(ctx);
    if (validatePet(pet)) {
      petModel
        .create(pet)
        .done((data) => {
          notification.info('Pet created.');
          ctx.redirect('#/dashboard'); // TODO: Or my-pets or new pet details ???
        })
        .fail(notification.handleError);
    }
  };

  const details = (ctx) => {
    const id = ctx.params.id;
    petModel
      .get(id)
      .done((pet) => {
        pet.isMyPet = pet._acl.creator === ctx.id;
        ctx.pet = pet;
        ctx.loadPartials({
          header: './templates/common/header.hbs',
          footer: './templates/common/footer.hbs',
          section: './templates/pet/details.hbs'
        }).then(function () {
          ctx.partials = this.partials;
          ctx.partial('./templates/common/main.hbs');
        });
      })
      .fail(notification.handleError);
  };

  const getRemove = (ctx) => {
    const id = ctx.params.id;
    petModel
      .get(id)
      .done((pet) => {
        ctx.pet = pet;
        ctx.loadPartials({
          header: './templates/common/header.hbs',
          footer: './templates/common/footer.hbs',
          section: './templates/pet/delete.hbs'
        }).then(function () {
          ctx.partials = this.partials;
          ctx.partial('./templates/common/main.hbs');
        });
      })
      .fail(notification.handleError);
  };

  const postRemove = (ctx) => {
    const id = ctx.params.id;
    petModel
      .del(id)
      .done(() => {
        notification.info('Listing deleted.');
        ctx.redirect('#/');
      })
      .fail(notification.handleError);
  };

  return {
    others,
    mine,
    category,
    getCreate,
    postCreate,
    details,
    getRemove,
    postRemove,
  };
})();
