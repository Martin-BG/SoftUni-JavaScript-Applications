const userModel = (() => {
  const module = 'user';
  const endpointLogin = 'login';
  const endpointLogout = '_logout';
  const endpointRegister = '';

  const login = (username, password) => {
    return requester.post(endpointLogin, {username, password}, module);
  };

  const logout = () => {
    return requester.post(endpointLogout, {}, module);
  };

  const register = (data) => {
    return requester.post(endpointRegister, data, module);
  };

  return {
    login,
    logout,
    register
  };
})();
