/**
 * Simple wrapper for AJAX get/post/put/delete requests
 * @class
 *
 * @param {Kinvey} helper
 */

export default function Requester(helper) {
  const buildRequest = (method, endpoint, module, data = {}) => {
    return {
      method,
      url: helper.url(endpoint, module),
      headers: helper.header(),
      data
    };
  };

  this.get = (endpoint, module) => {
    return $.ajax(buildRequest('get', endpoint, module));
  };

  this.post = (endpoint, data, module) => {
    return $.ajax(buildRequest('post', endpoint, module, data));
  };

  this.update = (endpoint, data, module) => {
    return $.ajax(buildRequest('put', endpoint, module, data));
  };

  this.remove = (endpoint, module) => {
    return $.ajax(buildRequest('delete', endpoint, module));
  };

  Object.freeze(this);
}
