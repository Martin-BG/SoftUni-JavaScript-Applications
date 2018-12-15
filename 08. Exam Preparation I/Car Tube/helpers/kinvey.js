/**
 * Helper for work with Kinvey:
 * [header()]{@link Kinvey~header}
 * [url()]{@link Kinvey~url}
 * @class
 *
 * @param {string} appKey - Kinvey application key
 * @param {string} appSecret - Kinvey application secret
 * @param {UserStorage} userStorage - [UserStorage]{@link UserStorage} object with
 * [isAuthenticated()]{@link UserStorage~isAuthenticated} and
 * [authToken()]{@link UserStorage~authToken} functions
 */

export default function Kinvey(appKey, appSecret, userStorage) {
  const baseUrl = 'https://baas.kinvey.com';
  const appData = 'appdata';

  /**
   * Build header with valid Authorization
   * @type {function(): {Authorization: string}}
   */
  this.header = () => {
    const authorization = userStorage.isAuthenticated()
      ? `Kinvey ${userStorage.authToken()}`
      : `Basic ${btoa(appKey + ':' + appSecret)}`;
    return {'Authorization': authorization};
  };

  /**
   * Build URL
   * @type {function(string, string): string}
   * @param {string} [endpoint] - end point
   * @param {string} [module] - 'appdata' (default) or 'user'
   * @returns {string} - Complete Kinvey URL
   */
  this.url = (endpoint = '', module = appData) => {
    return baseUrl + '/' + module + '/' + appKey + '/' + endpoint;
  };

  Object.freeze(this);
}
