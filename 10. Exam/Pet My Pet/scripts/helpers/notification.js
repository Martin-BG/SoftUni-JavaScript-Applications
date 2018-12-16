const notification = (() => {
  const idLoadingBox = 'loadingBox';
  const idInfoBox = 'infoBox';
  const idErrorBox = 'errorBox';
  const innerSelector = 'span';
  const timeout = 3000;

  const $infoBox = $(`#${idInfoBox}`);
  const $errorBox = $(`#${idErrorBox}`);
  const $loadingBox = $(`#${idLoadingBox}`);
  const $infoText = $(`#${idInfoBox} ${innerSelector}`);
  const $errorText = $(`#${idErrorBox} ${innerSelector}`);

  $(document).on({
    ajaxStart: () => $loadingBox.show(),
    ajaxStop: () => $loadingBox.fadeOut(100)
  });

  $infoBox.off('click');
  $errorBox.off('click');

  $infoBox.on('click', () => $infoBox.fadeOut({complete: () => $infoText.text('')}));
  $errorBox.on('click', () => $errorBox.fadeOut({complete: () => $errorText.text('')}));

  const info = (message) => {
    $infoText.text(message);
    $infoBox.show();
    setTimeout(() => $infoBox.fadeOut(), timeout);
  };

  const error = (message) => {
    $errorText.text(message);
    $errorBox.show();
  };

  const handleError = (errorObj) => {
    let message = JSON.stringify(errorObj);
    if (errorObj.readyState === 0) {
      message = 'Cannot connect to server.';
    }
    if (errorObj.responseJSON) {
      message = errorObj.responseJSON.description || errorObj.responseJSON.error || JSON.stringify(errorObj.responseJSON);
    }
    error(message);
  };

  const hideAll = () => {
    $infoBox.fadeOut(0);
    $errorBox.fadeOut(0);
    $loadingBox.fadeOut(0);
    $infoText.text('');
    $errorText.text('');
  };

  const hideError = () => {
    $errorBox.fadeOut(0);
    $errorText.text('');
  };

  return {
    info,
    error,
    handleError,
    hideError,
    hideAll
  };
})();
