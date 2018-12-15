/**
 * Car Model
 * @class
 *
 * @param {Requester} requester
 */

export default function CarModel(requester) {
  const baseEndpoint = 'cars';

  this.all = () => {
    const endpoint = `${baseEndpoint}?query={}&sort={"_kmd.ect": -1}`;
    return requester.get(endpoint);
  };

  this.mine = (username) => {
    const endpoint = `${baseEndpoint}?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`;
    return requester.get(endpoint);
  };

  this.create = (data) => {
    return requester.post(baseEndpoint, data);
  };

  this.get = (id) => {
    const endpoint = `${baseEndpoint}/${id}`;
    return requester.get(endpoint);
  };

  this.edit = (data, id) => {
    const endpoint = `${baseEndpoint}/${id}`;
    return requester.update(endpoint, data);
  };

  this.delete = (id) => {
    const endpoint = `${baseEndpoint}/${id}`;
    return requester.remove(endpoint);
  };

  Object.freeze(this);
}
