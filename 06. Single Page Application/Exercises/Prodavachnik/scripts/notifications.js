const notifications = (() => {
// Handle notifications
  $(document).on({
    ajaxStart: () => $('#loadingBox').show(),
    ajaxStop: () => $('#loadingBox').fadeOut()
  });

  function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.text(message);
    infoBox.show();
    setTimeout(() => infoBox.fadeOut(), 3000);
  }

  function showError(message) {
    let errorBox = $('#errorBox');
    errorBox.text(message);
    errorBox.show();
  }

  return {
    showInfo,
    showError,
  };
})();
