/**
 * Notifications controller
 * @class
 *
 * @param idLoadingBox{string} idLoadingBox - Loading box ID in HTML document
 * @param {string} idInfoBox - Info box ID in HTML document
 * @param {string} idErrorBox - Error box ID in HTML document
 * @param {string} innerSelector - The element inside box where message text should placed
 * (ex. 'span' for <div id='infoBox'><span>Message</span></div>)
 * @param {number} timeout - Info messages timeout in ms
 */

export default function Notification(idLoadingBox = 'loadingBox',
                                     idInfoBox = 'infoBox',
                                     idErrorBox = 'errorBox',
                                     innerSelector = 'span',
                                     timeout = 3000) {
  const $infoBox = $(`#${idInfoBox}`);
  const $errorBox = $(`#${idErrorBox}`);
  const $loadingBox = $(`#${idLoadingBox}`);
  const $infoText = $(`#${idInfoBox} ${innerSelector}`);
  const $errorText = $(`#${idErrorBox} ${innerSelector}`);

  /**
   * Initialize notifications
   */
  (() => {
    $(document).on({
      ajaxStart: () => $loadingBox.show(),
      ajaxStop: () => $loadingBox.fadeOut(100)
    });

    $infoBox.off('click');
    $errorBox.off('click');

    $infoBox.on('click', () => $infoBox
      .fadeOut({complete: () => $infoText.text('')}));
    $errorBox.on('click', () => $errorBox
      .fadeOut({complete: () => $errorText.text('')}));
  })();

  /**
   * Show info message which fades out automatically
   *
   * @param {string} message - text to display
   */
  this.info = (message) => {
    $infoText.text(message);
    $infoBox.show();
    setTimeout(() => $infoBox.fadeOut(), timeout);
  };

  /**
   * Show error message
   *
   * @param {string} message -text to display
   */
  this.error = (message) => {
    $errorText.text(message);
    $errorBox.show();
  };

  /**
   * Extract and display error message from error object (for use in catch clauses)
   * Check readyState and responseJSON properties
   *
   * @param {object} errorObj - error object
   */
  this.handleError = (errorObj) => {
    let message = JSON.stringify(errorObj);
    if (errorObj.readyState === 0) {
      message = 'Cannot connect to server.';
    }
    if (errorObj.responseJSON) {
      message = errorObj.responseJSON.description || errorObj.responseJSON.error || JSON.stringify(errorObj.responseJSON);
    }
    this.error(message);
  };

  /**
   * Hides all notifications and clears info and error texts
   */
  this.hideAll = () => {
    $infoBox.fadeOut(0);
    $errorBox.fadeOut(0);
    $loadingBox.fadeOut(0);
    $infoText.text('');
    $errorText.text('');
  };

  /**
   * Hides error notification and clear its text
   */
  this.hideError = () => {
    $errorBox.fadeOut(0);
    $errorText.text('');
  };

  Object.freeze(this);
}
