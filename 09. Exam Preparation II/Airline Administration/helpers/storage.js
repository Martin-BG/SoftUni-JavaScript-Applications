const storage = function () {
  const appKey = 'kid_ByBlX_TyE';
  const appSecret = 'b692ae865792478fbc792b01679efcc8';

  const saveData = function (key, value) {
    localStorage.setItem(appKey + key, JSON.stringify(value));
  };

  const getData = function (key) {
    return JSON.parse(localStorage.getItem(appKey + key));
  };

  const deleteData = function (key) {
    localStorage.removeItem(appKey + key);
  };

  const saveUser = function (data) {
    saveData('userInfo', {
      id: data._id,
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name
    });

    saveData('authToken', data._kmd.authtoken);
  };

  const deleteUser = function () {
    deleteData('authToken');
    deleteData('userInfo');
  };

  return {
    saveData,
    getData,
    deleteData,
    appKey,
    appSecret,
    saveUser,
    deleteUser
  };
}();
