const notifications = (() => {
  const timeout = 3000;

  const $loadingBox = $('#loadingBox');
  const $infoBox = $('#infoBox');
  const $errorBox = $('#errorBox');

  $(document).on({
    ajaxStart: () => $loadingBox.show(),
    ajaxStop: () => $loadingBox.fadeOut()
  });

  const info = (message) => {
    $infoBox.text(message);
    $infoBox.show();
    setTimeout(() => $infoBox.fadeOut(), timeout);
  };

  const error = (message) => {
    $errorBox.text(message);
    $errorBox.show();
  };

  const handleError = (response) => {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0) {
      errorMsg = 'Cannot connect to server.';
    }
    if (response.responseJSON) {
      errorMsg = response.responseJSON.description || response.responseJSON.error || 'Unknown error';
    }
    error(errorMsg);
  };

  return {
    info,
    error,
    handleError
  };
})();
