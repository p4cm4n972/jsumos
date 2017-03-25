var express = require('express');
var router = express.Router();


var db = require('../public/javascripts/db.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  var collection = db.get().collection('player');
  collection.find().toArray(function (err, play) {
     player1 = play[1].username;
     player2 = play[2].username;
  var collection = db.get().collection('scores');
  collection.find().toArray(function (err, data) {
    res.render('index', { title: 'Bienvenue sur JSUMOS',file: data, username: data[0].username, score: data[0].score, player1: player1, player2: player2});
  });
  });

});

module.exports = router;
