var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');


var app = express();

var db = require('../public/javascripts/db.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcom to JSumos' });
});
router.post('/', function (req, res, next) {
  var collection = db.get().collection('player');
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.pwd, salt);
  collection.insert({ pseudo: req.body.pseudo, pwd: hash });
  var collection = db.get().collection('scores');
  collection.find().toArray(function (err, data) {
    res.render('log', { title: 'Welcom to JSumos', file: data,username: data[0].username, score: data[0].score, pseudo1: data[0].username, pseudo2: player2 });
  });
});

/*router.get('/log', function (req, res, next) {
  var collection = db.get().collection('player');
  collection.find().toArray(function (err, play) {
    player1 = play[1];
    player2 = play[2];
    var collection = db.get().collection('scores');
    collection.find().toArray(function (err, data) {
      console.log('READ DATABASE');
      res.render('log', { title: 'Bienvenue sur JSUMOS', file: data, username: data[0].username, score: data[0].score, pseudo1: player1, pseudo2: player2 });
    });
  });
});*/




module.exports = router;
