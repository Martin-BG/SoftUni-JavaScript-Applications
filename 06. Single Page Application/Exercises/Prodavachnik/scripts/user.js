const user = (() => {

  const saveSession = (data) => {
    localStorage.setItem('username', data.username);
    localStorage.setItem('id', data._id);
    localStorage.setItem('authtoken', data._kmd.authtoken);
    view.logged();
  };

  const login = async () => {
    const $form = $('#formLogin');
    const username = $form.find('input[name="username"]').val();
    const password = $form.find('input[name="passwd"]').val();

    try {
      const response = await requester.post('user', 'login', 'basic', {username, password});
      saveSession(response);
      view.show('viewAds');
      notifications.info('Successfully logged in!');
    } catch (e) {
      notifications.handleError(e);
    }
  };

  const register = async () => {
    const $form = $('#formRegister');
    const username = $form.find('input[name="username"]').val();
    const password = $form.find('input[name="passwd"]').val();

    try {
      const response = await requester.post('user', '', 'basic', {username, password});
      saveSession(response);
      view.show('viewAds');
      notifications.info('Successfully registered!');
    } catch (e) {
      notifications.handleError(e);
    }
  };

  const logout = async () => {
    try {
      await requester.post('user', '_logout', 'kinvey', {authtoken: localStorage.getItem('authtoken')});
      localStorage.clear(); // Clears all session storage on logout
      view.anonymous();
      view.show('viewHome');
      notifications.info('Logout successful!');
    } catch (e) {
      notifications.handleError(e);
    }
  };

  return {
    login,
    register,
    logout,
  };
})();
