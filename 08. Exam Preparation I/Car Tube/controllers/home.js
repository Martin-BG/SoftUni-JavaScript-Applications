/**
 * Home page controller
 * @class
 */

export default function Home() {

  this.index = (ctx) => {
    if (ctx.isAuth) {
      ctx.redirect('#/cars/all');
    } else {
      ctx.partial('views/home/index.hbs');
    }
  };

  Object.freeze(this);
}
