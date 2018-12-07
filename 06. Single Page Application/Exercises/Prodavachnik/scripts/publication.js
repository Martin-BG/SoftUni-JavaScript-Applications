const publication = (() => {

  const all = async () => {
    const $content = $('#content');
    const ads = await requester.get('appdata', 'adverts');
    ads.forEach(a => {
      if (a._acl.creator === user.id()) {
        a.isAuthor = true;
      }
    });
    const context = {ads};
    const html = view.templates['catalog'](context);
    $content.html(html);
    $content.find('.edit').on('click', openEditAdd);
    $content.find('.delete').on('click', remove);
  };

  const create = async () => {
    const $form = $('#formCreateAd');
    const title = $form.find('input[name="title"]').val().trim();
    const description = $form.find('textarea[name="description"]').val().trim();
    const price = $form.find('input[name="price"]').val().trim();
    const imageUrl = $form.find('input[name="imageUrl"]').val().trim();
    const publisher = user.name();

    if (title.length === 0) {
      notifications.error('Title can\'t be empty');
      return;
    }

    if (price.length === 0) {
      notifications.error('Price can\'t be empty');
      return;
    }

    const newAdd = {
      title,
      description,
      price,
      imageUrl,
      publisher
    };

    try {
      await requester.post('appdata', 'adverts', '', newAdd);
      view.show('viewAds');
      notifications.info('Ad created!');
      $form[0].reset();
    } catch (error) {
      notifications.handleError(error);
    }
  };

// Delete an add
  const remove = async () => {
    const $publication = $($(event.currentTarget).parent());
    const id = $publication.attr('data-id');
    requester.remove('appdata', 'adverts' + '/' + id, '');
    $publication.parent().remove();
  };

// Edit an add
  const edit = async (id, publisher, date) => {
    // TODO
    console.log(event.currentTarget);
  };

// Open edit add view
  const openEditAdd = async () => {
    // TODO
    console.log(event.currentTarget);
  };

  return {
    all,
    create,
    remove,
    edit,
    openEditAdd,
  };
})();
