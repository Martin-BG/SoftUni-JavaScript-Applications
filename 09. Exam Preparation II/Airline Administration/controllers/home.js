const home = (function () {
  const index = function (ctx) {
    if (userModel.isAuthorized()) {
    }
    ctx.partial('views/home/index.hbs');
  };

  return {
    index
  };
}());
