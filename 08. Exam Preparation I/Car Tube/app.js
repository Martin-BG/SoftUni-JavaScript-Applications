import Storage from './helpers/storage.js';
import Kinvey from './helpers/kinvey.js';
import Requester from './helpers/requester.js';
import UserStorage from './models/user-storage.js';
import UserModel from './models/user-model.js';
import Notification from './controllers/notification.js';
import NavBar from './controllers/nav-bar.js';
import User from './controllers/user.js';
import Home from './controllers/home.js';

import CarModel from './models/car-model.js';
import Car from './controllers/car.js';

$(() => {
  const appKey = 'kid_SkPS5gfeV';
  const appSecret = '8b79f786cf1c448dbe1785263e45cc34';

  const notification = new Notification('loadingBox', 'infoBox', 'errorBox', 'span', 3000);
  const storage = new Storage('session', appKey + '_', true);
  const userStorage = new UserStorage(storage);
  const kinvey = new Kinvey(appKey, appSecret, userStorage);
  const requester = new Requester(kinvey);
  const userModel = new UserModel(requester);
  const navBar = new NavBar(userStorage);
  const user = new User(userModel, userStorage, notification);
  const home = new Home(notification);

  const carModel = new CarModel(requester);
  const car = new Car(carModel, notification);

  (Sammy('#container', function () {
    this.use('Handlebars', 'hbs');

    this.before({except: {}}, (ctx) => {
      ctx.username = userStorage.name();
      ctx.id = userStorage.id();
      ctx.isAuth = !!ctx.id;
      notification.hideError();
      navBar.update();
    });

    this.get('#/', home.index);
    this.get('#/login', user.getLogin);
    this.post('#/login', user.postLogin);
    this.get('#/logout', user.logout);
    this.get('#/register', user.getRegister);
    this.post('#/register', user.postRegister);

    this.get('#/cars/all', car.all);
    this.get('#/cars/mine', car.mine);
    this.get('#/cars/create', car.createView);
    this.post('#/cars/create', car.create);
    this.get('#/cars/edit/:id', car.editView);
    this.put('#/cars/edit/:id', car.edit);
    this.get('#/cars/details/:id', car.details);
    this.get('#/cars/delete/:id', car.delete);

  })).run('#/');
});

