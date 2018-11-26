function attachEvents() {
  const host = 'https://judgetests.firebaseio.com/';
  const $forecast = $('#forecast');
  const $current = $('#current');
  const $upcoming = $('#upcoming');

  const weatherSymbols = {
    'Sunny': '&#x2600;', // ☀
    'Partly sunny': '&#x26C5;', // ⛅
    'Overcast': '&#x2601;', // ☁
    'Rain': '&#x2614;' // ☂
  };

  $('#submit').on('click', getWeather);

  function getWeather() {
    const locationName = $('#location').val();

    $.get(host + 'locations.json')
      .then(parseData)
      .catch(handleError);

    function parseData(codes) {
      const location = codes.filter(e => e.name === locationName)[0];

      if (location) {
        Promise
          .all([
            $.get(`${host}forecast/today/${location.code}.json`),
            $.get(`${host}forecast/upcoming/${location.code}.json`)
          ])
          .then(displayResults)
          .catch(handleError);

        function displayResults([today, upcoming]) {
          $forecast.show();

          $current.empty();
          $current.append('<div class="label">Current conditions</div>');
          $current.append(`<span class="condition symbol">${weatherSymbols[today.forecast.condition]}</span>`);
          $current.append(`
            <span class="condition">
                <span class="forecast-data">${today.name}</span>
                <span class="forecast-data">${today.forecast.low}&#176; / ${today.forecast.high}&#176;</span>
                <span class="forecast-data">${today.forecast.condition}</span>
            </span>`);

          $upcoming.empty();
          $upcoming.append('<div class="label">Three-day forecast</div>');
          for (let next of upcoming.forecast) {
            $upcoming.append(`
            <span class="upcoming">
                <span class="symbol">${weatherSymbols[next.condition]}</span>
                <span class="forecast-data">${next.low}&#176; / ${next.high}&#176;</span>
                <span class="forecast-data">${next.condition}</span>
            </span>`);
          }
        }
      } else {
        handleError();
      }
    }
  }

  function handleError() {
    $upcoming.empty();
    $current.empty();
    $current.append('<div>Error</div>');
    $forecast.show();
  }
}
