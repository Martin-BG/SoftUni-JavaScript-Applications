function attachEvents() {
  const baseUrl = 'https://baas.kinvey.com/appdata/kid_BJeMLiQAQ/players/';
  const HttpMethod = {'GET': 'GET', 'POST': 'POST', 'PUT': 'PUT', 'DELETE': 'DELETE'};
  const Authorization = 'Basic ' + btoa('guest:guest');

  const $players = $('#players');
  const $canvas = $('#canvas');
  const $save = $('#save');
  const $reload = $('#reload');
  const $addPlayerBtn = $('#addPlayer');
  const $addPlayerName = $('#addName');

  const error = (err) => {
    console.log(err);
  };

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

    $(html)
      .find('.play')
      .on('click', async () => {
        await $save.click();

        $save.on('click', null, player, async () => {
          await remote(HttpMethod.PUT, baseUrl + player._id, JSON.stringify(player))
            .catch(error);
          clearInterval(document.getElementById('canvas').intervalId);
          $canvas.hide();
          $save.hide();
          $reload.hide();
          remote().then(initPlayers).catch(error);
        });

        $reload.on('click', null, player, async () => {
          player.money -= 60;
          player.bullets = 6;
          await remote(HttpMethod.PUT, baseUrl + player._id, JSON.stringify(player))
            .catch(error);
        });

        $canvas.show();
        $save.show();
        $reload.show();
        loadCanvas(player);
      });

    $(html)
      .find('.delete')
      .on('click', () => {
        remote(HttpMethod.DELETE, `${baseUrl}${player._id}`)
          .then($(html).remove())
          .catch(error);
      });

    return html;
  };

  const addPlayer = async () => {
    const name = $addPlayerName.val().trim();
    if (name && name.length) {
      let player = {name, 'money': 500, 'bullets': 6};
      await remote(HttpMethod.POST, baseUrl, JSON.stringify(player))
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
  $save.on('click', () => {});

  initPlayers();
}
