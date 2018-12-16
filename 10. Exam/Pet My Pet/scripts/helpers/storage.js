const storage = (() => {
  const storage = sessionStorage;
  const prefix = 'user_';
  const keyUsername = prefix + 'name';
  const keyUserId = prefix + 'id';
  const keyAuthToken = prefix + 'token';

  const buildKey = (key) => prefix + key;
  const set = (key, value) => storage.setItem(buildKey(key), JSON.stringify(value));
  const get = (key) => JSON.parse(storage.getItem(buildKey(key)));
  const has = (key) => !!storage.getItem(buildKey(key));
  const remove = (key) => {storage.removeItem(buildKey(key));};
  const clear = () => {storage.clear();};
  const name = () => get(keyUsername);
  const id = () => get(keyUserId);
  const authToken = () => get(keyAuthToken);
  const isAuthenticated = () => has(keyAuthToken);

  const saveUser = (user) => {
    set(keyUsername, user.username);
    set(keyUserId, user._id);
    set(keyAuthToken, user._kmd.authtoken);
  };

  const clearUser = () => {
    remove(keyUsername);
    remove(keyUserId);
    remove(keyAuthToken);
  };

  const getUser = () => {
    return {
      name: name(),
      id: id(),
      token: authToken()
    };
  };

  return {
    saveUser,
    getUser,
    clearUser,
    isAuthenticated,
    authToken,
    clear
  };
})();
