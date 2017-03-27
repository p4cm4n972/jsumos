var express = require('express');
var router = express.Router();

var app = express();

var db = require('../public/javascripts/db.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  var collection = db.get().collection('scores');
  collection.find().toArray(function (err, data) {
    res.render('index', { title: 'Bienvenue sur JSUMOS',file: data, username: data[0].username, score: data[0].score});
  });
  });


router.post('/', function (req, res, next) {
  console.log('WRITE DATABASE');
  console.log(req.body.username);
  var collection = db.get().collection('player');
  collection.insert({ username: req.body.username });
  res.render('log', { title: 'Bienvenue sur JSUMOS', file: data, player1: data[0], player2: data[1] });
});

router.get('/log', function (req, res, next) {
  var collection = db.get().collection('player');
  collection.find().toArray(function (err, play) {
    player1 = play[1];
    player2 = play[2];
    var collection = db.get().collection('scores');
    collection.find().toArray(function (err, data) {
      console.log('READ DATABASE')
      res.render('log', { title: 'Bienvenue sur JSUMOS', file: data, username: data[0].username, score: data[0].score, pseudo1: player1, pseudo2: player2 });
    });
  });
});


app.use('/', router);

module.exports = router;
