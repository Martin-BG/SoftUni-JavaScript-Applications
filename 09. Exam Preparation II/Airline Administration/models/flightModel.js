const flightModel = (() => {
  const flightsUrl = `appdata/${storage.appKey}/flights`;

  const add = (params) => {
    const data = {
      'destination': params.destination,
      'origin': params.origin,
      'departure': params.departureDate,
      'departureTime': params.departureTime,
      'seats': params.seats,
      'cost': params.cost,
      'image': params.img,
      'isPublished': !!params.public
    };

    return requester.post(flightsUrl, data);
  };

  return {
    add,
  };
})();
