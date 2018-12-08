const user = (() => {

  const storage = sessionStorage;

  const name = () => storage.getItem('username');
  const id = () => storage.getItem('id');
  const authtoken = () => storage.getItem('authtoken');

  const saveSession = (data) => {
    storage.setItem('username', data.username);
    storage.setItem('id', data._id);
    storage.setItem('authtoken', data._kmd.authtoken);
    view.logged();
  };

  const login = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const $form = $('#formLogin');
    const userData = {
      username: $form.find('input[name="username"]').val(),
      password: $form.find('input[name="passwd"]').val()
    };

    try {
      const response = await requester.post('user', 'login', 'basic', userData);
      saveSession(response);
      view.show('viewAds');
      notifications.info('Successfully logged in!');
      $form[0].reset(); // === $form.trigger('reset');
    } catch (e) {
      notifications.handleError(e);
    }
  };

  const register = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const $form = $('#formRegister');
    const userData = {
      username: $form.find('input[name="username"]').val(),
      password: $form.find('input[name="passwd"]').val()
    };

    try {
      const response = await requester.post('user', '', 'basic', userData);
      saveSession(response);
      view.show('viewAds');
      notifications.info('Successfully registered!');
      $form[0].reset(); // === $form.trigger('reset');
    } catch (e) {
      notifications.handleError(e);
    }
  };

  const logout = async () => {
    try {
      await requester.post('user', '_logout', 'kinvey', {authtoken: authtoken()});
      storage.clear(); // Clears all session storage on logout
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
    name,
    id,
    authtoken
  };
})();
