const petModel = (() => {
  const baseEndpoint = 'pets';

  const all = () => {
    const endpoint = `${baseEndpoint}?query={}&sort={"likes": -1}`;
    return requester.get(endpoint);
  };

  const category = (category) => {
    const endpoint = `${baseEndpoint}?query={"category":"${category}"}&sort={"likes": -1}`;
    return requester.get(endpoint);
  };

  const others = (userId) => {
    const endpoint = `${baseEndpoint}?query={"$nor":[{"_acl.creator":"${userId}"}]}`;
    return requester.get(endpoint);
  };

  const mine = (userId) => {
    const endpoint = `${baseEndpoint}?query={"_acl.creator":"${userId}"}`;
    return requester.get(endpoint);
  };

  const create = (data) => {
    return requester.post(baseEndpoint, data);
  };

  const get = (id) => {
    const endpoint = `${baseEndpoint}/${id}`;
    return requester.get(endpoint);
  };

  const edit = (data, id) => {
    const endpoint = `${baseEndpoint}/${id}`;
    return requester.update(endpoint, data);
  };

  const del = (id) => {
    const endpoint = `${baseEndpoint}/${id}`;
    return requester.remove(endpoint);
  };

  return {
    all,
    category,
    others,
    mine,
    create,
    get,
    edit,
    del
  };
})();
