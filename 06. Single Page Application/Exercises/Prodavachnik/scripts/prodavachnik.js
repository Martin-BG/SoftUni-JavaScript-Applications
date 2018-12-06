function startApp() {

  const templates = {};

  loadTemplates();

  async function loadTemplates() {
    const [adsCatalogTemplate, adBoxTemplate]
      = await Promise.all([
      $.get('./templates/ads-catalog.hbs'),
      $.get('./templates/box-partial.hbs')
    ]);
    templates['catalog'] = Handlebars.compile(adsCatalogTemplate);
    Handlebars.registerPartial('adBox', adBoxTemplate);
  }

  // Attach click events
  (() => {
    $('header').find('a[data-target]').click(navigateTo);
    $('#buttonLoginUser').click(login);
    $('#buttonRegisterUser').click(register);
    $('#linkLogout').click(logout);
    $('#buttonCreateAd').click(createAd);
    $('.notification').click(function () {
      $(this).hide();
    });
  })();

  let requester = (() => {
    const appKey = 'kid_BJcZftNP-';
    const appSecret = '55297dee18e3431aa460d74048b4bdf5';
    const baseUrl = 'https://baas.kinvey.com/';

    // Creates the authentication header
    function makeAuth(type) {
      return type === 'basic'
        ? 'Basic ' + btoa(appKey + ':' + appSecret)
        : 'Kinvey ' + localStorage.getItem('authtoken');
    }

    // Creates request object to kinvey
    function makeRequest(method, module, endpoint, auth) {
      return req = {
        method,
        url: baseUrl + module + '/' + appKey + '/' + endpoint,
        headers: {
          'Authorization': makeAuth(auth)
        }
      };
    }

    // Function to return GET promise
    function get(module, endpoint, auth) {
      return $.ajax(makeRequest('GET', module, endpoint, auth));
    }

    // Function to return POST promise
    function post(module, endpoint, auth, data) {
      let req = makeRequest('POST', module, endpoint, auth);
      req.data = data;
      return $.ajax(req);
    }

    // Function to return PUT promise
    function update(module, endpoint, auth, data) {
      let req = makeRequest('PUT', module, endpoint, auth);
      req.data = data;
      return $.ajax(req);
    }

    // Function to return DELETE promise
    function remove(module, endpoint, auth) {
      return $.ajax(makeRequest('DELETE', module, endpoint, auth));
    }

    return {
      get,
      post,
      update,
      remove
    };
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

  // Saves username/id/authtoken to local storage
  function saveSession(data) {
    localStorage.setItem('username', data.username);
    localStorage.setItem('id', data._id);
    localStorage.setItem('authtoken', data._kmd.authtoken);
    userLoggedIn();
  }

  // Logs in the user
  async function login() {
    let form = $('#formLogin');
    let username = form.find('input[name="username"]').val();
    let password = form.find('input[name="passwd"]').val();

    try {
      let response = await requester.post('user', 'login', 'basic', {username, password});
      saveSession(response);
      showView('viewAds');
      showInfo('Successfully logged in!');
    } catch (e) {
      handleError(e);
    }
  }

  // Register a user
  async function register() {
    let form = $('#formRegister');
    let username = form.find('input[name="username"]').val();
    let password = form.find('input[name="passwd"]').val();

    try {
      let response = await requester.post('user', '', 'basic', {username, password});
      saveSession(response);
      showView('viewAds');
      showInfo('Successfully registered!');
    } catch (e) {
      handleError(e);
    }
  }

  // Logout a user
  async function logout() {
    try {
      await requester.post('user', '_logout', 'kinvey', {authtoken: localStorage.getItem('authtoken')});
      localStorage.clear(); // Clears all session storage on logout
      userLoggedOut();
      showView('viewHome');
      showInfo('Logout successful!');
    } catch (e) {
      handleError(e);
    }
  }

  // Load all ads
  async function loadAds() {

  }

  // Create an add
  async function createAd() {

  }

  // Delete an add
  async function deleteAd() {

  }

  // Edit an add
  async function editAd(id, publisher, date) {

  }

  // Open edit add view
  async function openEditAdd() {

  }
}
