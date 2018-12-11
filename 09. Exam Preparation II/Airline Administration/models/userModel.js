const userModel = (function () {
  const userUrl = `user/${storage.appKey}`;

  const login = function (username, password) {
    const authString = btoa(`${username}:${password}`);
    const headers = {
      Authorization: 'Basic ' + authString
    };

    const data = {username, password};
    const url = userUrl + '/login';

    return requester.post(url, data, headers);
  };

  const logout = function () {
    const url = userUrl + '/_logout';

    return requester.post(url);
  };

  const register = function (params) {
    const data = {
      username: params.username,
      password: params.password,
      first_name: params.first_name,
      last_name: params.last_name
    };

    const authString = btoa(`${storage.appKey}:${storage.appSecret}`);
    const headers = {Authorization: 'Basic ' + authString};

    return requester.post(userUrl, data, headers);
  };

  const isAuthorized = function () {
    return !!storage.getData('authToken');
  };

  return {
    login,
    logout,
    register,
    isAuthorized
  };
}());
