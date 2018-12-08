const startApp = () => {
  $('header').find('a[data-target]').on('click', view.navigateTo);
  $('#formLogin').on('submit', user.login);
  $('#formRegister').on('submit', user.register);
  $('#linkLogout').on('click', user.logout);
  $('#formCreateAd').on('submit', publication.create);
  $('.notification').on('click', () => $(event.target).fadeOut());

  view.show('viewHome');

  if (user.authtoken() !== null) {
    view.logged();
  } else {
    view.anonymous();
  }
};
