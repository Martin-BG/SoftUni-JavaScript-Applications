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
    $('#buttonLoginUser').click(user.login);
    $('#buttonRegisterUser').click(user.register);
    $('#linkLogout').click(user.logout);
    $('#buttonCreateAd').click(publication.create);
    $('.notification').click(function () {
      $(this).hide();
    });
  })();

  if (localStorage.getItem('authtoken') !== null) {
    userLoggedIn();
  } else {
    userLoggedOut();
  }

  // Handle notifications
  $(document).on({
    ajaxStart: () => $('#loadingBox').show(),
    ajaxStop: () => $('#loadingBox').fadeOut()
  });

  function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.text(message);
    infoBox.show();
    setTimeout(() => infoBox.fadeOut(), 3000);
  }

  function showError(message) {
    let errorBox = $('#errorBox');
    errorBox.text(message);
    errorBox.show();
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
