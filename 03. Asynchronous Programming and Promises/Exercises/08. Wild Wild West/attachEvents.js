function attachEvents() {
  const baseUrl = 'https://baas.kinvey.com/appdata/kid_BJeMLiQAQ/players/';
  const httpMethod = {'GET': 'GET', 'POST': 'POST', 'PUT': 'PUT', 'DELETE': 'DELETE'};
  const authorization = 'Basic ' + btoa('guest:guest');

  const $players = $('#players');
  const $canvas = $('#canvas');
  const $save = $('#save');
  const $reload = $('#reload');
  const $addPlayerBtn = $('#addPlayer');
  const $addPlayerName = $('#addName');

  const error = (err) => {
    console.log(err);
  };

  const remote = (method = httpMethod.GET,
                  url = baseUrl,
                  data) => {
    const contentType = (method === httpMethod.GET) ?
      'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json';
    return $.ajax({
        method,
        url,
        data,
      headers: {Authorization: authorization},
        contentType
      }
    );
  };

  const playerTemplate = (player) => {
    const html = $(`
        <div class="player" data-id=${player._id}>
        <div class="row">
            <label>Name:</label>
            <label class="name">${player.name}</label>
        </div>
        <div class="row">
            <label>Money:</label>
            <label class="money">${player.money}</label>
        </div>
        <div class="row">
            <label>Bullets:</label>
            <label class="bullets">${player.bullets}</label>
        </div>
        <button class="play">Play</button>
        <button class="delete">Delete</button>
        </div>
      `);

    const savePlayer = async () => {
      await remote(httpMethod.PUT, baseUrl + player._id, JSON.stringify(player))
        .catch(error);

      clearInterval(document.getElementById('canvas').intervalId);

      $canvas.hide();
      $save.hide();
      $reload.hide();

      $save.off('click');
      $reload.off('click');

      $(html).find('.money').text(player.money);
      $(html).find('.bullets').text(player.bullets);

      $(html).find('.delete').prop('disabled', false);
      $('.play').prop('disabled', false);
    };

    const reloadGun = async () => {
      player.money -= 60;
      player.bullets = 6;

      await remote(httpMethod.PUT, baseUrl + player._id, JSON.stringify(player))
        .then(() => {
          $(html).find('.money').text(player.money);
          $(html).find('.bullets').text(player.bullets);
        })
        .catch(error);
    };

    const startGame = async () => {
      await $save.click();

      $(html).find('.delete').prop('disabled', true);
      $('.play').prop('disabled', true);

      $save.on('click', null, player, savePlayer);

      $reload.on('click', null, player, reloadGun);

      $canvas.show();
      $save.show();
      $reload.show();

      loadCanvas(player);
    };

    const deletePlayer = () => {
      remote(httpMethod.DELETE, `${baseUrl}${player._id}`)
        .then($(html).remove())
        .catch(error);
    };

    $(html)
      .find('.play')
      .on('click', startGame);

    $(html)
      .find('.delete')
      .on('click', deletePlayer);

    return html;
  };

  const addPlayer = async () => {
    const name = $addPlayerName.val().trim();
    if (name && name.length) {
      let player = {name, 'money': 500, 'bullets': 6};
      await remote(httpMethod.POST, baseUrl, JSON.stringify(player))
        .then((data) => player = data)
        .catch(error);
      $addPlayerName.val('');
      $players.append(playerTemplate(player));
    }
  };

  const initPlayers = () => {
    remote()
      .then(players => {
        $players.empty();
        players.forEach(player => {
          $players.append(playerTemplate(player));
        });
      })
      .catch(error);
  };

  $addPlayerBtn.on('click', addPlayer);

  initPlayers();
}
