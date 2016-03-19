var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
var Verify = require('./verify');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.find({'selectedBy': req.decoded._doc._id})
        .populate('favoriteDishes')
        .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });

})

.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    var userID = req.decoded._doc._id;
    var dishID = req.body._id;
    Favorites.findOne({"selectedBy": userID}, function (err, favorite) {
		if (err) throw err;
		if (!favorite) {
                favorite = new Favorites({selectedBy: req.decoded._doc._id, dishes:[]});
            }
            if (favorite.dishes.indexOf(req.body._id) == -1) {
                favorite.dishes.push(req.body._id);
            }
            favorite.save(function (err, favorite) {
                if (err) throw err;
                console.log('Favorites updates!');
                res.json(favorite);
            });
        });
    })
	
.delete(Verify.verifyOrdinaryUser,function (req, res, next) {
        Favorites.remove({selectedBy: req.decoded._doc._id}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
  });

favoriteRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser,function (req, res, next) {
      Favorites.findOne({selectedBy: req.decoded._doc._id}, function (err, favorite) {
            if (err) throw err;

            var index = favorite.dishes.indexOf(req.params.dishId);
            if (index != -1) {
                favorite.dishes.splice(index, 1);
            }
            favorite.save(function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });
    });

module.exports = favoriteRouter;