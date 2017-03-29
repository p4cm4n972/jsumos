var express = require('express');
var router = express.Router();

var app = express();


var db = require('../public/javascripts/db.js');

router.get('/log', function (req, res, next) {
  var collection = db.get().collection('player');
  collection.find().toArray(function (err, play) {
    var player1 = play[0].username;
    var player2 = play[1].username;
    var collection = db.get().collection('scores');
    collection.find().toArray(function (err, data) {
      res.render('log', { title: 'Bienvenue sur JSUMOS', file: data, username: data[0].username, score: data[0].score, pseudo1: player1, pseudo2: player2 });
    });
  });
});

app.use('/', router);

module.exports = router
