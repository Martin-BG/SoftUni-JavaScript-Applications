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

  const handleError = (reason) => {
    error(reason.responseJSON.description);
  };

  return {
    info,
    error,
    handleError
  };
})();
