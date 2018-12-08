const requester = require('../helpers/requester');
const storage = require('../helpers/storage');

module.exports = (function(){
    const login = function(username, password){
        var authString = btoa(`${username}:${password}`);
        var headers = { 
            Authorization: 'Basic ' + authString 
        };

        var data = { username, password };
        var url = `user/${storage.appKey}/login`;
        
        return requester.post(url, data, headers);
    };

    const logout = function(){
        var url = `user/${storage.appKey}/_logout`;

        return requester.post(url);
    }

    const register = function(params){
        var data = {
            username: params.username,
            password: params.password,
            first_name: params.first_name,
            last_name: params.last_name
        }

        var authString = btoa(`${storage.appKey}:${storage.appSecret}`);
        var headers = { Authorization: 'Basic ' + authString};
        var url = 'user/' + storage.appKey;

        return requester.post(url, data, headers);
    };

    const isAuthorized = function(){
        return !!storage.getData('authToken');
    };

    return {
        login,
        logout,
        register,
        isAuthorized
    }
}());