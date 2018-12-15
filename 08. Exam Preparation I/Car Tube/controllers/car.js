/**
 * Car Controller
 * @class
 * @param {CarModel} carModel
 * @param {Notification} notification
 */
export default function Car(carModel, notification) {

  this.parseCar = (ctx) => {
    return {
      title: ctx.params.title.trim(),
      description: ctx.params.description.trim(),
      brand: ctx.params.brand.trim(),
      model: ctx.params.model.trim(),
      year: ctx.params.year,
      imageUrl: ctx.params.imageUrl.trim(),
      fuel: ctx.params.fuelType.trim(),
      price: ctx.params.price,
      seller: ctx.username,
    };
  };

  this.validateCar = (car, currentUser) => {
    if (!car.seller || car.seller !== currentUser) {
      notification.error('Invalid seller!');
      return false;
    }
    if (!car.title || !car.description || !car.brand || !car.model || !car.imageUrl || !car.fuel) {
      notification.error('All fields are required!');
      return false;
    }
    if (car.title.length > 33) {
      notification.error('Title length should not exceeds 33 characters!');
      return false;
    }
    if (car.description.length < 30 || car.description.length > 450) {
      notification.error('Description length should be between 30 and 450 characters long!');
      return false;
    }
    if (car.brand.length > 11) {
      notification.error('Brand length should not exceeds 11 characters!');
      return false;
    }
    if (car.fuel.length > 11) {
      notification.error('Fuel Type length should not exceeds 11 characters!');
      return false;
    }
    if (car.model.length < 4 || car.model.length > 11) {
      notification.error('Model length should be between 4 and 11 characters long!');
      return false;
    }
    if (car.year < 1000 || car.year > 9999) {
      notification.error('Year should be 4 digits long!');
      return false;
    }
    if (car.price < 0 || car.price > 1000000) {
      notification.error('Price cannot exceeds 1 000 000!');
      return false;
    }
    if (!car.imageUrl.toLowerCase().startsWith('http')) {
      notification.error('Invalid image URL address!');
      return false;
    }
    return true;
  };

  this.all = (ctx) => {
    carModel
      .all()
      .done((cars) => {
        cars.forEach((car) => {
          car.isAuthor = car._acl.creator === ctx.id;
        });
        ctx.cars = cars;
        ctx.loadPartials({
          car: 'views/car/car.hbs',
        }).then(function () {
          ctx.partials = this.partials;
          ctx.partial('views/car/all.hbs');
        });
      })
      .fail(notification.handleError);
  };

  this.mine = (ctx) => {
    carModel
      .mine(ctx.username)
      .done((cars) => {
        ctx.cars = cars;
        ctx.loadPartials({
          car: 'views/car/car-mine.hbs',
        }).then(function () {
          ctx.partials = this.partials;
          ctx.partial('views/car/mine.hbs');
        });
      })
      .fail(notification.handleError);
  };

  this.createView = (ctx) => {
    ctx.partial('views/car/create.hbs');
  };

  this.create = (ctx) => {
    const car = this.parseCar(ctx);

    if (this.validateCar(car, ctx.username)) {
      carModel
        .create(car)
        .done(function (data) {
          notification.info(`Listing created.`);
          ctx.redirect(`#/cars/details/${data._id}`);
        })
        .fail(notification.handleError);
    }

    return false;
  };

  this.editView = (ctx) => {
    const id = ctx.params.id;
    carModel
      .get(id)
      .done(function (car) {
        car.isAuthor = car._acl.creator === ctx.id;
        ctx.car = car;
        ctx.partial('views/car/edit.hbs');
      })
      .fail(notification.handleError);
  };

  this.edit = (ctx) => {
    const car = this.parseCar(ctx);

    if (this.validateCar(car, ctx.username)) {
      carModel
        .edit(car, ctx.params.id)
        .done(function (data) {
          notification.info(`Listing ${data.title} updated.`);
          ctx.redirect(`#/cars/details/${data._id}`);
        })
        .fail(notification.handleError);
    }
    return false;
  };

  this.details = (ctx) => {
    const id = ctx.params.id;
    carModel
      .get(id)
      .done(function (car) {
        car.isAuthor = car._acl.creator === ctx.id;
        ctx.car = car;
        ctx.partial('views/car/details.hbs');
      })
      .fail(notification.handleError);
  };

  this.delete = (ctx) => {
    const id = ctx.params.id;
    carModel
      .delete(id)
      .done(() => {
        notification.info('Listing deleted.');
        ctx.redirect('#/');
      })
      .fail(notification.handleError);
  };

  Object.freeze(this);
}
