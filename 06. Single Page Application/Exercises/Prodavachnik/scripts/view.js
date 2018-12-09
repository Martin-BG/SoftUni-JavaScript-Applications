const view = (() => {
  const $loggedInUser = $('#loggedInUser');
  const $linkHome = $('#linkHome');
  const $linkLogin = $('#linkLogin');
  const $linkRegister = $('#linkRegister');

  const templates = {};

  (async () => {
    const [adsCatalogTemplate, adBoxTemplate] = await Promise.all([
      $.get('./templates/publication/catalog.hbs'),
      $.get('./templates/publication/box-partial.hbs')
    ]);

    templates['catalog'] = Handlebars.compile(adsCatalogTemplate);
    Handlebars.registerPartial('adBox', adBoxTemplate);
  })();

  // Shows only the correct links for a logged in user
  const logged = () => {
    $loggedInUser.text(`Welcome ${user.name()}`);
    $loggedInUser.show();

    $('#menu a').show();

    $linkLogin.hide();
    $linkRegister.hide();
  };

  // Shows only the correct links for an anonymous user
  const anonymous = () => {
    $loggedInUser.text('');
    $loggedInUser.hide();

    $('#menu a').hide();

    $linkHome.show();
    $linkLogin.show();
    $linkRegister.show();
  };

  const show = (viewName) => {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();

    if (viewName !== 'viewEditAd') {
      const $form = $(`#${viewName} form`);
      if ($form.length) { // Clear input fields
        $form.each((i, f) => f.reset()); // === f.trigger('reset');
      }
    }

    if (viewName === 'viewAds') {
      publication.all();
    }
  };

  const navigateTo = () => {
    const target = $(event.currentTarget).attr('data-target');
    show(target);
  };

  return {
    templates,
    logged,
    anonymous,
    navigateTo,
    show,
  };
})();
