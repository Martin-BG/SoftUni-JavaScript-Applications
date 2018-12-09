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

  const create = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const $form = $('#formCreateAd');
    const title = $form.find('input[name="title"]').val().trim();
    const description = $form.find('textarea[name="description"]').val().trim();
    const price = $form.find('input[name="price"]').val().trim();
    const imageUrl = $form.find('input[name="imageUrl"]').val().trim();
    const publisher = user.name();

    // if (title.length === 0) {
    //   notifications.error('Title can\'t be empty');
    //   return;
    // }
    //
    // if (price.length === 0) {
    //   notifications.error('Price can\'t be empty');
    //   return;
    // }

    const newAd = {
      title,
      description,
      price,
      imageUrl,
      publisher
    };

    try {
      await requester.post('appdata', 'adverts', '', newAd);
      view.show('viewAds');
      notifications.info('Ad created!');
      $form[0].reset(); // === $form.trigger('reset');
    } catch (error) {
      notifications.handleError(error);
    }
  };

  const remove = async (event) => {
    const $publication = $($(event.currentTarget).parent());
    const id = $publication.attr('data-id');
    await requester.remove('appdata', `adverts/${id}`, '');
    $publication.parent().remove();
  };

  const edit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const $form = $('#formEditAd');
    const id = $form.find('input[name="id"]').val();
    const title = $form.find('input[name="title"]').val().trim();
    const description = $form.find('textarea[name="description"]').val().trim();
    const price = $form.find('input[name="price"]').val().trim();
    const imageUrl = $form.find('input[name="imageUrl"]').val().trim();

    const ad = {
      title,
      description,
      price,
      imageUrl
    };

    try {
      await requester.update('appdata', `adverts/${id}`, '', ad);
      view.show('viewAds');
      notifications.info('Ad edited!');
      $form[0].reset(); // === $form.trigger('reset');
    } catch (error) {
      notifications.handleError(error);
    }
  };

  const openEditAdd = async (event) => {
    const $publication = $($(event.currentTarget).parent());
    const id = $publication.attr('data-id');

    const ad = await requester.get('appdata', `adverts/${id}`, '');

    const $form = $('#formEditAd');
    $form.find('input[name="id"]').val(id);
    $form.find('input[name="publisher"]').val(user.name());
    $form.find('input[name="title"]').val(ad.title);
    $form.find('textarea[name="description"]').val(ad.description);
    $form.find('input[name="price"]').val(ad.price);
    $form.find('input[name="imageUrl"]').val(ad.imageUrl);
    $form.on('submit', edit);

    view.show('viewEditAd');
  };

  return {
    all,
    create
  };
})();
