function attachEvents() {
  const baseUrl = 'https://baas.kinvey.com/appdata/kid_BJeMLiQAQ/biggestCatches/';
  const HttpMethod = {'GET': 'GET', 'POST': 'POST', 'PUT': 'PUT', 'DELETE': 'DELETE'};
  const Authorization = 'Basic ' + btoa('guest:guest');

  const $catches = $('#catches');

  const remote = (method = HttpMethod.GET,
                  url = baseUrl,
                  data) => {
    const contentType = (method === HttpMethod.GET) ?
      'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json';
    return $.ajax({
        method,
        url,
        data,
        headers: {Authorization},
        contentType
      }
    );
  };

  const loadAllCatches = async () => {
    const catches = await remote();
    $catches.empty();
    catches.forEach(c => {
      const html = $(`
            <div class="catch" data-id=${c._id}>
            <label>Angler</label>
            <input type="text" class="angler" value="${c.angler}">
            <label>Weight</label>
            <input type="number" class="weight" value=${c.weight}>
            <label>Species</label>
            <input type="text" class="species" value="${c.species}">
            <label>Location</label>
            <input type="text" class="location" value="${c.location}">
            <label>Bait</label>
            <input type="text" class="bait" value="${c.bait}">
            <label>Capture Time</label>
            <input type="number" class="captureTime" value=${c.captureTime}>
            <button class="update">Update</button>
            <button class="delete">Delete</button>
        </div>`);

      $(html).find('.update').on('click', async () => {
        const angler = $(html).find('.angler').val();
        const weight = +$(html).find('.weight').val();
        const species = $(html).find('.species').val();
        const location = $(html).find('.location').val();
        const bait = $(html).find('.bait').val();
        const captureTime = +$(html).find('.captureTime').val();

        await remote(HttpMethod.PUT, `${baseUrl}${c._id}`,
          JSON.stringify({angler, weight, species, location, bait, captureTime}));
      });

      $(html).find('.delete').on('click', async () => {
        await remote(HttpMethod.DELETE, `${baseUrl}${c._id}`);
        $(html).remove();
      });

      $catches.append(html);
    });
  };

  const addCatch = async () => {
    const $addForm = $('#addForm > input');
    const angler = $addForm[0].value;
    const weight = +$addForm[1].value;
    const species = $addForm[2].value;
    const location = $addForm[3].value;
    const bait = $addForm[4].value;
    const captureTime = +$addForm[5].value;

    if (angler && weight && species && location && bait && captureTime) {
      for (let i = 0; i <= 5; i++) {
        $addForm[i].value = '';
      }

      await remote(HttpMethod.POST,
        baseUrl,
        JSON.stringify({angler, weight, species, location, bait, captureTime}));

      await loadAllCatches();
    }
  };

  $('.load').on('click', loadAllCatches);
  $('.add').on('click', addCatch);

  loadAllCatches().then();
}
