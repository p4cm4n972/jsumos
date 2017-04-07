var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;

var db = require('./public/javascripts/db.js');





db.connect('mongodb://jsumos:made81MA@ds155080.mlab.com:55080/jsumos', function(err) {
  if (err) {
    console.log('Impossible de se connecter à la base de données.');
    process.exit(1);
  } 
});
var log = require('./routes/log');
var index = require('./routes/index');

var app = express();





var http = require('http').Server(app);

var io = require('socket.io')(http);


// MOTEUR DE TEMPLATE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//MIDDLEWARE
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/index', index);
app.use('/log', log);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//GENERATEUR ID
var guid = function () {
  var s4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
};

//GENERATEUR DE NOMBRE ALEATOIRE
var coordsAleatoire = function (min, max) {
  var nb = min + (max - min + 1) * Math.random();
  return Math.floor(nb);
};
//CONNEXION
var player = 0;
var joueur;
io.on('connection', function (socket) {
  
  //restriction à 2 connection
  /*io.of('/').clients(function (error, clients) {
    if (clients.length === 2) {
      io.emit('update', { avatar, mesBols });
    }
  });*/
   
      
  player++;
  mesBols = [];
  var avatar = {
    id: socket.id,
    top: '0px',
    left: '0px',
    width: '100px',
    height: '100px',
    url: "/images/avatar" + player + ".png",
    total: 0
  };




  if (player == 2) { player = 0 };

  //UPDATE BOLS
  function createBol() {
    var bol = {
     id: guid(),
      top: coordsAleatoire(100, 700) + 'px',
      left: coordsAleatoire(10, 900) + 'px',
      width: '50px',
      height: '50px',
      url: '/images/bol.png',
    };
    return bol;
  }
  //creation tableau de bols
  for (var i = 0; i < 50; i++) {
    mesBols.push(createBol())
  }
  //EMISSIONS DES DONNEES
socket.on('login', function(pseudoValue){
  var pseudoOK = pseudoValue.pseudoValue;
io.emit('login', pseudoOK);
})
  socket.on('start', function () {
    mesBols.forEach(function (element) {
      io.emit('animation', element);
    });
  });
 socket.on('clock', function () {
      io.emit('clock');
  })
  socket.on('move', function (position) {
        avatar.top = parseFloat(position.top) + 10 + 'px';
        avatar.left = parseFloat(position.left) + 10 + 'px';

        io.emit('update', {avatar,mesBols});
      });

  socket.on('eat', function (clicking) {
    io.emit('eatAction', clicking);
  })

  //DECONNEXION
  socket.on('disconnect', function () {
    console.log('deconnexion');
    io.emit('destroy', avatar)
  });


});


http.listen(8000, function () {
  console.log('HTTP listen on : 8000');
});