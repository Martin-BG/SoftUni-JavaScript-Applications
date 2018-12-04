$(() => {
  renderCatTemplate();

  function renderCatTemplate() {
    $.get('templates/card.hbs')
      .then((res) => {
        const template = Handlebars.compile(res);
        $('#allCats').html(template({cats}));
        $('button').on('click', toggleInfo);
      })
      .catch((err) => $('#allCats').html($(err.responseText)));
  }

  const showStatusCodeText = 'Show status code';
  const hideStatusCodeText = 'Hide status code';

  function toggleInfo() {
    const $btn = $(this);
    if ($btn.text() === showStatusCodeText) {
      $btn.text(hideStatusCodeText);
      $btn.next().show();
    } else {
      $btn.text(showStatusCodeText);
      $btn.next().hide();
    }
  }
});
