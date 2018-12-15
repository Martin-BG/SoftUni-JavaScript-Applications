/**
 * User Model
 * @class
 *
 * @param {Requester} requester
 */

export default function UserModel(requester) {
  const module = 'user';
  const endpointLogin = 'login';
  const endpointLogout = '_logout';
  const endpointRegister = '';

  this.login = (username, password) => {
    return requester.post(endpointLogin, {username, password}, module);
  };

  this.logout = () => {
    return requester.post(endpointLogout, {}, module);
  };

  this.register = (data) => {
    return requester.post(endpointRegister, data, module);
  };

  Object.freeze(this);
}
