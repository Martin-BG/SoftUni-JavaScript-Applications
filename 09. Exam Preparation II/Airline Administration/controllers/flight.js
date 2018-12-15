const flight = (() => {

  const addGet = (ctx) => {
    if (userModel.isAuthorized()) {
      ctx.partial('views/flight/add.hbs');
    } else {
      ctx.redirect('#/login');
    }
  };

  const addPost = (ctx) => {
    flightModel.add(ctx.params)
      .done(() => {
        notification.info('Added successfully');
        ctx.redirect('/#');
      })
      .fail(notifications.handleError);
  };

  return {
    addGet,
    addPost,
  };
})();
