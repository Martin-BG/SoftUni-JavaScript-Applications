const requester = (() => {
  const baseUrl = 'https://baas.kinvey.com';
  const appData = 'appdata';
  const appKey = 'kid_Hy669RmgV';
  const appSecret = '2dd1fb161e6344518560929715d465ed';

  const header = () => {
    const authorization = storage.isAuthenticated()
      ? `Kinvey ${storage.authToken()}`
      : `Basic ${btoa(appKey + ':' + appSecret)}`;
    return {'Authorization': authorization};
  };

  const url = (endpoint = '', module = appData) => {
    return baseUrl + '/' + module + '/' + appKey + '/' + endpoint;
  };

  const buildRequest = (method, endpoint, module, data = {}) => {
    return {
      method,
      url: url(endpoint, module),
      headers: header(),
      data
    };
  };

  const get = (endpoint, module) => {
    return $.ajax(buildRequest('get', endpoint, module));
  };

  const post = (endpoint, data, module) => {
    return $.ajax(buildRequest('post', endpoint, module, data));
  };

  const update = (endpoint, data, module) => {
    return $.ajax(buildRequest('put', endpoint, module, data));
  };

  const remove = (endpoint, module) => {
    return $.ajax(buildRequest('delete', endpoint, module));
  };

  return {
    get,
    post,
    update,
    remove
  };
})();
