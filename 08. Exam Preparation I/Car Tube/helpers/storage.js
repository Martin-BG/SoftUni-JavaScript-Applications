/**
 * Wrapper for work with sessionStorage or localStorage
 * @class
 * @param {string} [type] - session (default) or local
 * @param {string} [keyPrefix] - Prefix to prepend to keys
 * @param {boolean} [reset] - Clear selected storage on initialization
 */

export default function Storage(type = 'session', keyPrefix = '', reset = false) {
  const prefix = keyPrefix.valueOf();

  const storage = ((type) => {
    if (type === 'session') {
      return sessionStorage;
    } else if (type === 'local') {
      return localStorage;
    } else {
      throw new Error('Incorrect storage type provided: ' + type);
    }
  })(type.valueOf());

  /**
   * Prepends specified on construction prefix to key
   * @type {function(string): string}
   * @param {string} key
   */
  const buildKey = (key) => prefix + key;

  /**
   * Create new key or update value if present
   * @type {function(string, string): void}
   * @param {string} key
   * @param {string} value
   */
  this.set = (key, value) => storage.setItem(buildKey(key), JSON.stringify(value));

  /**
   * Get value of a key or null if not found
   * @type {function(string): (string|null)}
   * @param {string} key
   */
  this.get = (key) => JSON.parse(storage.getItem(buildKey(key)));

  /**
   * Return true if key is present or false otherwise
   * @type {function(string): boolean}
   * @param {string} key
   */
  this.has = (key) => !!storage.getItem(buildKey(key));

  /**
   * Remove key from storage if present
   * @type {function(string): void}
   * @param {string} key
   */
  this.remove = (key) => {storage.removeItem(buildKey(key));};

  /**
   * Clear storage
   * @type {function(): void}
   */
  this.clear = () => {storage.clear();};

  if (reset) {
    this.clear();
  }

  Object.freeze(this);
}
