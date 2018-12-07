const startApp = () => {
  $('header').find('a[data-target]').on('click', view.navigateTo);
  $('#buttonLoginUser').on('click', user.login);
  $('#buttonRegisterUser').on('click', user.register);
  $('#linkLogout').on('click', user.logout);
  $('#buttonCreateAd').on('click', publication.create);
  $('.notification').on('click', () => $(event.target).fadeOut());

  view.show('viewHome');

  if (user.authtoken() !== null) {
    view.logged();
  } else {
    view.anonymous();
  }
};
