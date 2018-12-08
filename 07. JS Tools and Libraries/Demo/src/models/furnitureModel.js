const requester = require('../helpers/requester');
const storage = require('../helpers/storage');

module.exports = (function(){
    const create = function(params){
        var data = {
            make: params.make,
            model: params.model,
            year: params.year,
            description: params.description,
            price: params.price,
            image: params.image,
            material: params.material
        };

        var url = `appdata/${storage.appKey}/furniture`;

        return requester.post(url, data);
    };

    const getAll = function(){
        let url = `appdata/${storage.appKey}/furniture`;

        return requester.get(url);
    };

    const getItem = function(id){
        let url = `appdata/${storage.appKey}/furniture/${id}`;

        return requester.get(url);
    };

    const getMine = function(){
        let url = `appdata/${storage.appKey}/furniture/`;
        let userId = storage.getData('userInfo').id;
        url += `?query={"_acl.creator":"${userId}"}`;

        return requester.get(url);
    };

    const deleteItem = function(id){
        let url = `appdata/${storage.appKey}/furniture/${id}`;

        return requester.del(url);
    };

    return {
        create,
        getAll,
        getItem,
        getMine,
        deleteItem
    };
}());