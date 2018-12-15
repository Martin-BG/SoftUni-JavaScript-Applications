/**
 * NavBar Controller
 * @class
 *
 * @param {UserStorage} userStorage
 */

export default function NavBar(userStorage) {

  /**
   * Hide and show elements depending authentication
   */
  this.update = () => {
    if (userStorage.isAuthenticated()) {
      $('#show-for-authenticated').show();
      $('#logged-user-name').text(userStorage.name());
    } else {
      $('#show-for-authenticated').hide();
      $('#logged-user-name').text('');
    }
  };

  Object.freeze(this);
}
