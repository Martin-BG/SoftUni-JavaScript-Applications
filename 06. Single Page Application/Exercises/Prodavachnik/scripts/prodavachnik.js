function startApp() {

  const templates = {};

  loadTemplates();

  async function loadTemplates() {
    const [adsCatalogTemplate, adBoxTemplate]
      = await Promise.all([
      $.get('./templates/publication/catalog.hbs'),
      $.get('./templates/publication/box-partial.hbs')
    ]);
    templates['catalog'] = Handlebars.compile(adsCatalogTemplate);
    Handlebars.registerPartial('adBox', adBoxTemplate);
  }

  // Attach click events
  (() => {
    $('header').find('a[data-target]').click(navigateTo);
    $('#buttonLoginUser').on('click', user.login);
    $('#buttonRegisterUser').on('click', user.register);
    $('#linkLogout').on('click', user.logout);
    $('#buttonCreateAd').on('click', publication.create);
    $('.notification').on('click', function () {
      $(this).hide();
    });
  })();

  if (localStorage.getItem('authtoken') !== null) {
    userLoggedIn();
  } else {
    userLoggedOut();
  }

  function handleError(reason) {
    showError(reason.responseJSON.description);
  }

  function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();

    if (viewName === 'viewAds') {
      loadAds();
    }
  }

  // Shows only the correct links for a logged in user
  function userLoggedIn() {

  }

  // Shows only the correct links for an anonymous user
  function userLoggedOut() {

  }

  function navigateTo() {

  }
}
