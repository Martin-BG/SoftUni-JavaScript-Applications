$(() => {
  const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');

    // GET REQUESTS
    this.get('index.html', function () {
      auth.isAuthed() ? this.redirect('#/home') : this.redirect('#/welcome');
    });
    this.get('#/welcome', function () {
      this.isAuthed = auth.isAuthed();
      this.loadPartials({
        navbar: 'templates/common/navbar.hbs',
        footer: 'templates/common/footer.hbs'
      }).then(function () {
        this.partial('templates/home/welcome.hbs');
      });
    });
    this.get('#/home', function () {
      if (!auth.isAuthed()) this.redirect('#/welcome');
      else this.redirect('#/carListings');
    });
    this.get('#/carListings', function (context) {
      context.isAuthed = auth.isAuthed();
      context.username = sessionStorage.getItem('username');
      carsService.loadCars()
        .then(function (cars) {
          context.cars = cars;
          if (context.cars.length > 1) context.hasCars = true;
          for (let car of context.cars) {
            if (car._acl.creator === sessionStorage.getItem('userId')) car.isAuthor = true;
          }
          context.loadPartials({
            navbar: 'templates/common/navbar.hbs',
            footer: 'templates/common/footer.hbs',
            car: 'templates/car-listings/car.hbs'
          }).then(function () {
            context.partials = this.partials;
            context.partial('templates/car-listings/carListings.hbs');
          });
        }).catch(notify.handleError);
    });
    this.get('#/logout', function (context) {
      auth.logout()
        .then(function () {
          sessionStorage.clear();
          notify.showInfo('Logout successful.');
          context.redirect('#/home');
        }).catch(notify.handleError);
    });
    this.get('#/login', function () {
      this.isAuthed = auth.isAuthed();
      this.loadPartials({
        navbar: 'templates/common/navbar.hbs',
        footer: 'templates/common/footer.hbs'
      }).then(function () {
        this.partial('templates/login/login.hbs');
      });
    });
    this.get('#/register', function () {
      this.isAuthed = auth.isAuthed();
      this.loadPartials({
        navbar: 'templates/common/navbar.hbs',
        footer: 'templates/common/footer.hbs'
      }).then(function () {
        this.partial('templates/register/register.hbs');
      });
    });
    this.get('#/createListing', function () {
      this.isAuthed = auth.isAuthed();
      this.username = sessionStorage.getItem('username');
      this.loadPartials({
        navbar: 'templates/common/navbar.hbs',
        footer: 'templates/common/footer.hbs',
      }).then(function () {
        this.partial('templates/car-listings/createListing.hbs');
      });
    });
    this.get('#/details/:id', function (context) {
      let carId = context.params.id;
      context.isAuthed = auth.isAuthed();
      context.username = sessionStorage.getItem('username');
      carsService.loadDetails(carId)
        .then(function (details) {
          if (details._acl.creator === sessionStorage.getItem('userId')) context.isAuthor = true;
          context.title = details.title;
          context.brand = details.brand;
          context.description = details.description;
          context.model = details.model;
          context.year = details.year;
          context.price = details.price;
          context.fuelType = details.fuel;
          context.imageUrl = details.imageUrl;
          context._id = details._id;
          context.loadPartials({
            navbar: 'templates/common/navbar.hbs',
            footer: 'templates/common/footer.hbs',
          }).then(function () {
            context.partials = this.partials;
            context.partial('templates/car-listings/details.hbs');
          });
        }).catch(notify.handleError);
    });
    this.get('#/edit/:id', function (context) {
      context.isAuthed = auth.isAuthed();
      context.username = sessionStorage.getItem('username');
      let carId = context.params.id;
      carsService.loadDetails(carId)
        .then(function (details) {
          context.title = details.title;
          context.brand = details.brand;
          context.description = details.description;
          context.model = details.model;
          context.year = details.year;
          context.price = details.price;
          context.fuelType = details.fuel;
          context.imageUrl = details.imageUrl;
          context._id = details._id;
          context.loadPartials({
            navbar: 'templates/common/navbar.hbs',
            footer: 'templates/common/footer.hbs',
          }).then(function () {
            context.partials = this.partials;
            context.partial('templates/car-listings/editListing.hbs');
          });
        }).catch(notify.handleError);

    });
    this.get('#/delete/:id', function (context) {
      console.log(context);
      context.isAuthed = auth.isAuthed();
      context.username = sessionStorage.getItem('username');
      let carId = context.params.id;
      carsService.deleteCar(carId)
        .then(function () {
          notify.showInfo('Car listing deleted!');
          context.redirect('#/carListings');
        }).catch(notify.handleError);
    });
    this.get('#/mylistings', function (context) {
      let username = sessionStorage.getItem('username');
      context.isAuthed = auth.isAuthed();
      context.username = username;
      carsService.loadMyCars(username)
        .then(function (myCars) {
          context.myCars = myCars;
          if (context.myCars.length > 0) context.hasListings = true;
          context.loadPartials({
            navbar: 'templates/common/navbar.hbs',
            footer: 'templates/common/footer.hbs',
            myCar: 'templates/car-listings/myCar.hbs'
          }).then(function () {
            context.partials = this.partials;
            context.partial('templates/car-listings/myListings.hbs');
          });
        }).catch(notify.handleError);
    });

    // POST REQUESTS
    this.post('#/login', function (context) {
      let username = context.params.username;
      let password = context.params.password;
      auth.login(username, password)
        .then(function (userInfo) {
          auth.saveSession(userInfo);
          notify.showInfo('Login successful');
          context.redirect('#/home');
        }).catch(notify.handleError);
    });
    this.post('#/register', function (context) {
      let username = context.params.username;
      let password = context.params.password;
      let repeat = context.params.repeatPass;
      let validUser = /^[a-zA-Z0-9]{3,}$/.test(username);
      let validPass = /^[a-zA-Z0-9]{6,}$/.test(password);
      if (username === '' || password === '' || repeat === '') notify.showError('Input fields must be filled');
      else if (!validUser) notify.showError('Username must be at least 3 characters long');
      else if (!validPass) notify.showError('Password must be at least 6 characters long');
      else {
        auth.register(username, password)
          .then(function () {
            notify.showInfo('Registration successful');
            auth.login(username, password)
              .then(function (userInfo) {
                auth.saveSession(userInfo);
                notify.showInfo('Login successful');
                context.redirect('#/home');
              }).catch(notify.handleError);
          }).catch(notify.handleError);
      }
    });
    this.post('#/createListing', function (context) {
      let title = context.params.title;
      let brand = context.params.brand;
      let description = context.params.description;
      let fuel = context.params.fuelType;
      let imageUrl = context.params.imageUrl;
      let model = context.params.model;
      let price = context.params.price;
      let year = context.params.year;
      let seller = sessionStorage.getItem('username');
      if (title === '' || brand === '' || description === '' || fuel === '' || imageUrl === '' || model === '' || price === '' || year === '') notify.showError('All input fields must be filled in.');
      else if (title.length > 33) notify.showError('Title too long!');
      else if (description.length > 450 || description.length < 30) notify.showError('Description must be between 30 and 450 characters long!');
      else if (brand.length > 11) notify.showError('Brand too long!');
      else if (fuel.length > 11) notify.showError('Fuel type too long!');
      else if (model.length > 11) notify.showError('Model too long!');
      else if (!imageUrl.startsWith('http')) notify.showError('Wrong image link!');
      else {
        carsService.createNewCar(title, brand, description, fuel, imageUrl, model, price, year, seller)
          .then(function () {
            notify.showInfo('Car listing created!');
            context.redirect('#/carListings');
          }).catch(notify.handleError);
      }
    });
    this.post('#/edit/:id', function (context) {
      let title = context.params.title;
      let brand = context.params.brand;
      let description = context.params.description;
      let fuel = context.params.fuelType;
      let imageUrl = context.params.imageUrl;
      let model = context.params.model;
      let price = context.params.price;
      let year = context.params.year;
      let carId = context.params.carId;
      let seller = sessionStorage.getItem('username');
      if (title === '' || brand === '' || description === '' || fuel === '' || imageUrl === '' || model === '' || price === '' || year === '') notify.showError('All input fields must be filled in.');
      else if (title.length > 33) notify.showError('Title too long!');
      else if (description.length > 450 || description.length < 30) notify.showError('Description must be between 30 and 450 characters long!');
      else if (brand.length > 11) notify.showError('Brand too long!');
      else if (fuel.length > 11) notify.showError('Fuel type too long!');
      else if (model.length > 11) notify.showError('Model too long!');
      else if (!imageUrl.startsWith('http')) notify.showError('Wrong image link!');
      else {
        carsService.editCar(carId, title, brand, description, fuel, imageUrl, model, price, year, seller)
          .then(function () {
            notify.showInfo('Car listing edited!');
            context.redirect('#/carListings');
          }).catch(notify.handleError);
      }
    });
  });
  app.run();
})();
