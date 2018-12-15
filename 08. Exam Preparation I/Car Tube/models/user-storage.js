/**
 * Storing nad retrieving user data to/from storage
 * @class
 *
 * @param {Storage} storage
 */

export default function UserStorage(storage) {
  const prefix = 'user_';
  const keyUsername = prefix + 'name';
  const keyUserId = prefix + 'id';
  const keyAuthToken = prefix + 'token';

  this.name = () => storage.get(keyUsername);
  this.id = () => storage.get(keyUserId);
  this.authToken = () => storage.get(keyAuthToken);
  this.isAuthenticated = () => storage.has(keyAuthToken);

  this.save = (user) => {
    storage.set(keyUsername, user.username);
    storage.set(keyUserId, user._id);
    storage.set(keyAuthToken, user._kmd.authtoken);
  };

  this.clear = () => {
    storage.remove(keyUsername);
    storage.remove(keyUserId);
    storage.remove(keyAuthToken);
  };

  Object.freeze(this);
}
