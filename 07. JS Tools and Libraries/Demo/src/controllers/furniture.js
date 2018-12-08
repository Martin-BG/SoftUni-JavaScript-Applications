const furnitureModel = require('../models/furnitureModel');
const userModel = require('../models/userModel');

module.exports = (function(){
    const getCreate = function(ctx){
        if(!userModel.isAuthorized()){
            ctx.redirect('#/login');
        } else {
            ctx.partial('views/furniture/furniture.hbs');
        }
    };

    const postCreate = function(ctx){
        furnitureModel.create(ctx.params).then(function(){
            ctx.redirect('#/furniture/all');
        });
    };

    const all = function(ctx){
        furnitureModel.getAll().then(function(data){
            ctx.furnitures = data;
            ctx.partial('views/furniture/all.hbs');
        });
    };

    const details = function(ctx){
        furnitureModel.getItem(ctx.params.id).then(function(data){
            ctx.item = data;
            ctx.partial('views/furniture/details.hbs');
        });
    };

    const mine = function(ctx){
        furnitureModel.getMine().then(function(data){
            ctx.furnitures = data;
            ctx.mine = true;
            ctx.partial('views/furniture/all.hbs');
        });
    };

    const deleteItem = function(ctx){
        furnitureModel.deleteItem(ctx.params.id).then(function(){
            ctx.redirect('#/furniture/mine');
        });
    }

    return {
        getCreate,
        postCreate,
        all,
        details,
        mine,
        deleteItem
    }
}());