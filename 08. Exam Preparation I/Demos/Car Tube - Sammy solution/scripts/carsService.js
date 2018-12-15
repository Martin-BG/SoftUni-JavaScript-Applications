let carsService = (() => {
  function loadCars() {
    return requester.get('appdata', `cars?query={}&sort={"_kmd.ect": -1}`, 'kinvey');
  }

  function loadDetails(carId) {
    return requester.get('appdata', `cars/${carId}`, 'kinvey');
  }

  function createNewCar(title, brand, description, fuel, imageUrl, model, price, year, seller) {
    let data = {
      title, brand, description, fuel, imageUrl, model, price, year, seller
    };
    return requester.post('appdata', 'cars', 'kinvey', data);
  }

  function editCar(carId, title, brand, description, fuel, imageUrl, model, price, year, seller) {
    let data = {
      title, brand, description, fuel, imageUrl, model, price, year, seller
    };

    return requester.update('appdata', 'cars/' + carId, 'kinvey', data);
  }

  function deleteCar(carId) {
    return requester.remove('appdata', 'cars/' + carId, 'kinvey');
  }

  function loadMyCars(username) {
    return requester.get('appdata', `cars?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`, 'kinvey');

  }

  return {
    loadCars,
    createNewCar,
    loadDetails,
    editCar,
    deleteCar,
    loadMyCars
  };
})();
