function startApp() {
  sessionStorage.clear();
  showHideMenuLinks();

  $('#registerButton').on('click', showRegisterView);
  $('#registerUser').on('click', registerUser);
  $('#loginButton').on('click', showLoginView);
  $('#logUserBtn').on('click', loginUser);
  $('#myListings').on('click', myListingView);
  $('#logout').on('click', logoutUser);
  $('#signUpBtn').on('click', showRegisterView);
  $('#signInBtn').on('click', showLoginView);
  $('#home').on('click', showHomeMenu);
  $('#allListings').on('click', allListings);
  $('#createListings').on('click', createListingsView);
  $('#createCars').submit(createCar);
  $('#editCars').submit(saveEditedCar);
  $('form').submit(function (event) {
    event.preventDefault();
  });
  // $('#registerUser').on('click', function (event) {
  //     event.preventDefault()
  // })
  // $('#registerButton').on('click', function (event) {
  //     event.preventDefault()
  // })

  function hideAllViews() {
    $('#main').hide();
    $('#login').hide();
    $('#registerForm').hide();
    $('#createCars').hide();
    $('#editCars').hide();
    $('#myCarListings').hide();
    $('#myCars').hide();
    $('#listDetails').hide();
    $('#car-listings').hide();
    $('#carMyListings').hide();
  }

  $(document).on({
    ajaxStart: function () {
      $('#loadingBox').show();
    },
    ajaxStop: function () {
      $('#loadingBox').hide();
    }
  });
  $('#infoBox', '#errorBox').on('click', function () {
    $(this).fadeOut();
  });

  function showInfo(message) {
    $('#infoBox').show();
    $('#infoBox > span').text(message);
    setTimeout(function () {
      $('#infoBox').fadeOut();
    }, 3000);
  }

  function showError(error) {
    $('#errorBox').show();
    $('#errorBox > span').text(error);
    $('#errorBox').on('click', function () {
      $(this).fadeOut();
    });
  }

  function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
      errorMsg = 'Cannot connect due to network error.';
    if (response.responseJSON && response.responseJSON.description)
      errorMsg = response.responseJSON.description;
    showError(errorMsg);
  }

  const kinveyBaseUrl = 'https://baas.kinvey.com/';
  const kinveyAppKey = 'kid_rkMtKform';
  const kinveyAppSecret = '53badeb768df46aaa0e0782d3c99a442';
  const kinveyAppAuthHeaders = {
    'Authorization': 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret),
  };

  function showHideMenuLinks() {
    hideAllViews();
    if (sessionStorage.getItem('authToken') === null) {
      $('#main').show();
      $('#allListings').hide();
      $('#carListings').hide();
      $('#createListings').hide();
      $('#car-listings').hide();
      $('#profile').hide();
      $('#myListings').hide();
      $('#carMyListings').hide();
    } else {
      $('#main').hide();
      $('#allListings').show();
      $('#myListings').show();
      $('#createListings').show();
      $('#profile').show();
      $('#carListings').hide();
      $('#car-listings').show();
      $('#carMyListings').hide();
      $('#welcm').text(`Welcome ${sessionStorage.getItem('userName')}`);
    }

  }

  function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('userId', userInfo._id);
    sessionStorage.setItem('userName', userInfo.username);
  }

  function getKinveyUserAuthHeaders() {
    return {
      'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken'),
    };
  }

  function showHomeMenu() {
    showHideMenuLinks();
  }

  function createListingsView() {
    hideAllViews();
    $('#createCars').show();
    $('#createCars').trigger('reset');
  }

  function showRegisterView() {
    hideAllViews();
    $('#registerForm').show();
    $('#registerForm').trigger('reset');
  }

  function showLoginView() {
    hideAllViews();
    $('#login').show();
    $('#formLogin').trigger('reset');
  }

  function loginUser() {
    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=password]').val();
    let usernameRegex = /[A-Za-z]{3,}/;
    let passRegex = /[A-Za-z0-9]{6,}/;
    if (!usernameRegex.test(username)) {
      showError('User name length has to be at least 3 characters long and contains just english letters.');
    } else if (!passRegex.test(password)) {
      showError('Password length has to be at least 6 characters long and contains just english letters and digits.');
    } else {
      $.ajax({
        method: 'POST',
        url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/login',
        data: {username, password},
        headers: kinveyAppAuthHeaders
      }).then(function (res) {
        saveAuthInSession(res);
        showHideMenuLinks();
        allListings();
        showInfo('Login successful.');
      }).catch(handleAjaxError);
    }
  }

  function registerUser() {
    let username = $('#registerForm input[name=username]').val();
    let password = $('#registerForm input[name=password]').val();
    let repeatPass = $('#registerForm input[name=repeatPass]').val();
    let usernameRegex = /[A-Za-z]{3,}/;
    let passRegex = /[A-Za-z0-9]{6,}/;
    if (!usernameRegex.test(username)) {
      showError('User name length has to be at least 3 characters long and contains just english letters.');
    } else if (password !== repeatPass) {
      showError('Password and repeat pass have to be equal.');
    } else if (password === '' && repeatPass === '') {
      showError('Password field is required');
    } else if (!passRegex.test(password)) {
      showError('Password length has to be at least 6 characters long and contains just english letters and digits.');
    } else {
      $.ajax({
        method: 'POST',
        url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/',
        headers: kinveyAppAuthHeaders,
        data: {username, password}
      }).then(function (res) {
        saveAuthInSession(res);
        showHideMenuLinks();
        allListings();
        showInfo('User registration successful.');
      }).catch(handleAjaxError);
    }

  }

  function logoutUser() {
    $.ajax({
      method: 'POST',
      url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/_logout',
      headers: getKinveyUserAuthHeaders()
    });
    sessionStorage.clear();
    $('#welcm').text('');
    showHideMenuLinks();
    showInfo('Logout successful.');
  }

  function allListings() {
    showHideMenuLinks();
    $.ajax({
      method: 'GET',
      url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/cars?query={}&sort={"_kmd.ect": -1}',
      headers: getKinveyUserAuthHeaders()
    }).then(function (resp) {
      $('#car-listings').show();
      $('#listings').empty();
      if (resp.length === 0) {
        $('#listings').append('<p class="no-cars">No cars in database.</p>');
      } else {
        for (const res of resp) {
          let mainDiv = $('<div class="listing">');
          let p = $('<p>').text(res.description);
          let img = $(`<img src="${res.imageUrl}">`);
          let h2 = $('<h2>').text(`Brand: ${res.brand}`);
          let divInfo = $('<div class="info">');
          let divData = $('<div id="data-info">');
          let h31 = $('<h3>').text(`Seller: ${res.seller}`);
          let h32 = $('<h3>').text(`Fuel: ${res.fuel}`);
          let h33 = $('<h3>').text(`Year: ${res.year}`);
          let h34 = $('<h3>').text(`Price: ${res.price} $`);
          $(divData).append(h31).append(h32).append(h33).append(h34);
          let divBtn = $('<div id="data-buttons">');
          let ul = $('<ul>');
          let liDetails = $('<li class="action">');
          let aDetails = $('<a href="#" class="button-carDetails">Details</a>').click(detailsCar.bind(this, res));
          $(liDetails).append(aDetails);
          $(ul).append(liDetails);
          $(divBtn).append(ul);
          if (sessionStorage.getItem('userId') === res._acl.creator) {
            let liEdit = $('<li class="action">');
            let aEdit = $('<a href="#" class="button-carDetails">edit</a>').click(editCar.bind(this, res));
            let liDelete = $('<li class="action">');
            let aDelete = $('<a href="#" class="button-carDetails">Delete</a>').click(deleteCar.bind(this, res));
            $(liEdit).append(aEdit);
            $(liDelete).append(aDelete);
            $(ul).append(liEdit).append(liDelete);
          }
          $(divInfo).append(divData).append(divBtn);
          $(mainDiv).append(p).append(img).append(h2).append(divInfo);
          $('#listings').append(mainDiv);

        }
      }

    }).catch(handleAjaxError);
  }

  function editCar(car) {
    hideAllViews();
    $('#editCars').attr('carId', car._id);
    $('#editCars').show();
    $('#editCars input[name=title]').val(car.title);
    $('#editCars input[name=description]').val(car.description);
    $('#editCars input[name=brand]').val(car.brand);
    $('#editCars input[name=model]').val(car.model);
    $('#editCars input[name=year]').val(car.year);
    $('#editCars input[name=imageUrl]').val(car.imageUrl);
    $('#editCars input[name=fuelType]').val(car.fuel);
    $('#editCars input[name=price]').val(car.price);

  }

  function saveEditedCar() {
    let seller = sessionStorage.getItem('userName');
    let title = $('#editCars input[name=title]').val();
    let description = $('#editCars input[name=description]').val();
    let brand = $('#editCars input[name=brand]').val();
    let model = $('#editCars input[name=model]').val();
    let year = $('#editCars input[name=year]').val();
    let imageUrl = $('#editCars input[name=imageUrl]').val();
    let fuel = $('#editCars input[name=fuelType]').val();
    let price = Number($('#editCars input[name=price]').val());
    let id = $('#editCars').attr('carId');
    if (title.length > 33) {
      showError('Title lenght is too long.');
    } else if (description.length < 30 || description.length > 450) {
      showError('Description name should be between 30 and 450 chars.');
    } else if (brand.length > 11 || fuel.length > 11 || model.length > 11) {
      showError('Brand, Fuel and Model should be less than 11 chars.');
    } else if (year.length !== 4) {
      showError('Year has contains 4 chars.');
    } else if (price > 1000000) {
      showError('Price is invalid');
    } else if (!imageUrl.startsWith('http')) {
      showError('Image url has to start with "http"');
    } else {
      $.ajax({
        method: 'PUT',
        url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/cars/' + id,
        headers: getKinveyUserAuthHeaders(),
        data: {seller, title, description, brand, model, year, imageUrl, fuel, price}
      }).then(function (res) {
        showHideMenuLinks();
        showInfo(`Listing ${title} updated.`);
        allListings();
      }).catch(handleAjaxError);
    }
  }

  function detailsCar(car) {
    hideAllViews();
    $('#listDetails').show();
    $('.my-listing-details').empty();
    let p = $('<p id="auto-title">').text(car.title);
    let img = $(`<img src="${car.imageUrl}">`);
    let divHeaders = $('<div class="listing-props">');

    let h2 = $('<h2>').text(`Brand: ${car.brand}`);
    let h31 = $('<h3>').text(`Model: ${car.model}`);
    let h32 = $('<h3>').text(`Year: ${car.year}`);
    let h33 = $('<h3>').text(`Fuel: ${car.fuel}`);
    let h34 = $('<h3>').text(`Price: ${car.price} $`);
    $(divHeaders).append(h2).append(h31).append(h32).append(h33).append(h34);

    if (sessionStorage.getItem('userId') === car._acl.creator) {
      let divHrefs = $('<div class="listings-buttons">');
      let a1 = $('<a href="#" class="button-list">Edit</a>').click(editCar.bind(this, car));
      let a2 = $('<a href="#" class="button-list">Delete</a>').click(deleteCar.bind(this, car));
      $(divHeaders).append(a1).append(a2);
      $('.my-listing-details').append(divHrefs);
    }

    let p1 = $('<p id="description-title">Description:</p>');
    let p2 = $(`<p id="description-para">${car.description}</p>`);

    $('.my-listing-details').append(p).append(img).append(divHeaders).append(p1).append(p2);
  }

  function deleteCar(car) {
    $.ajax({
      method: 'DELETE',
      url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/cars/' + car._id,
      headers: getKinveyUserAuthHeaders()
    }).then(function (res) {
      allListings();
      showInfo('Listing deleted');
    });
  }

  function createCar() {
    let seller = sessionStorage.getItem('userName');
    let title = $('#createCars input[name=title]').val();
    let description = $('#createCars input[name=description]').val();
    let brand = $('#createCars input[name=brand]').val();
    let model = $('#createCars input[name=model]').val();
    let year = $('#createCars input[name=year]').val();
    let imageUrl = $('#createCars input[name=imageUrl]').val();
    let fuel = $('#createCars input[name=fuelType]').val();
    let price = Number($('#createCars input[name=price]').val());
    if (title.length > 33) {
      showError('Title lenght is too long.');
    } else if (description.length < 30 || description.length > 450) {
      showError('Description name should be between 30 and 450 chars.');
    } else if (brand.length > 11 || fuel.length > 11 || model.length > 11) {
      showError('Brand, Fuel and Model should be less than 11 chars.');
    } else if (year.length !== 4) {
      showError('Year has contains 4 chars.');
    } else if (price > 1000000) {
      showError('Price is invalid');
    } else if (!imageUrl.startsWith('http')) {
      showError('Image url has to start with "http"');
    } else if (title === '' || description === '' || brand === '' || model === '' ||
      year === '' || imageUrl === '' || fuel === '' || price === '') {
      showError('All fields have to be full!');
    } else {
      $.ajax({
        method: 'POST',
        data: {seller, title, description, brand, model, year, imageUrl, fuel, price},
        headers: getKinveyUserAuthHeaders(),
        url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/cars'
      }).then(function (res) {
        showHideMenuLinks();
        showInfo('Listing created.');
        allListings();
      }).catch(handleAjaxError);
    }
  }

  function myListingView() {
    hideAllViews();
    $.ajax({
      method: 'GET',
      url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + `/cars?query={"seller":"${sessionStorage.getItem('userName')}"}&sort={"_kmd.ect": -1}`,
      headers: getKinveyUserAuthHeaders()
    }).then(function (cars) {
      $('#carMyListings').show();
      $('#myCars').empty();
      if (cars.length === 0) {
        $('#myCars').append($('<p class="no-cars">').text(' No cars in database.'));
      } else {

        for (let car of cars) {
          let div = $('<div class="my-listing">');
          div.append($('<p id="listing-title">').text(`${car.title}`));
          div.append($('<img>').attr('src', `${car.imageUrl}`));

          let secondDiv = $('<div class="listing-props">');
          secondDiv.append($('<h2>').text(`Brand: ${car.brand}`));
          secondDiv.append($('<h3>').text(`Model: ${car.model}`));
          secondDiv.append($('<h3>').text(`Year: ${car.year}`));
          secondDiv.append($('<h3>').text(`Price: ${car.price}`));

          let thirdDiv = $('<div class="my-listing-buttons">');
          thirdDiv.append($('<a href="#" class="my-button-list">').text('Details').on('click', function () {
            detailsCar(car);
          }));
          thirdDiv.append($('<a href="#" class="my-button-list">').text('Edit').on('click', function () {
            editCar(car);
          }));
          thirdDiv.append($('<a href="#" class="my-button-list">').text('Delete').on('click', function () {
            deleteCar(car);
          }));
          div.append(secondDiv);
          div.append(thirdDiv);
          $('#myCars').append(div);
        }
      }
      $('#myCars').show();

    }).catch(handleAjaxError);
  }
}
