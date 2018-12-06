const requester = (() => {
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
    return {
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
