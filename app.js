var express = require('express');
var server = require('http').Server(express);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var bcrypt = require('bcrypt');

const  saltRounds = 10;
const plainTextPassword = 'az12er34ty56';

var db = require('./public/javascripts/db.js');

var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/jsumos',
  collection: 'mySessions'
})

db.connect('mongodb://localhost:27017/jsumos', function(err) {
  if (err) {
    console.log('Impossible de se connecter à la base de données.');
    process.exit(1);
  } else {
    app.listen(3000, function() {
      console.log('Le serveur est disponible sur le port 3000');
    });
  }
});

var index = require('./routes/index');



var app = express();
var io = require('socket.io')(server);

//MOTEUR DE TEMPLATE  (view engine setup)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//MIDDLEWARE
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use(session({
  secret: 'a1z2e3r4t5y6u7i8o9',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));
app.use(require('express-session')({
  secret: 'thisa secret',
  cookie: {
    maxAge: 1000 * 60 * 60
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
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
io.on('connection', function (socket) {
  console.log('new connexion')
  //restriction à 2 connection
  io.of('/').clients(function (error, clients) {
    if (clients.length === 2) {
      io.emit('update', { avatar, mesBols });
    }
  });
      socket.on('move', function (position) {
        avatar.top = parseFloat(position.top) + 'px';
        avatar.left = parseFloat(position.left) + 'px';
      })

  player++;
  mesBols = [];
  var avatar = {
    id: guid(),
    top: '0px',
    left: '0px',
    width: '100px',
    height: '100px',
    url: "/images/avatar" + player + ".png",
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

  socket.on('start', function () {
    mesBols.forEach(function (element) {
      io.emit('animation', element);
    });

  });
  socket.on('eat', function (target) {
    console.log(target);
    io.emit('eatAction', target);
  })

  //DECONNEXION
  socket.on('disconnect', function () {
    console.log('deconnexion');
    io.emit('destroy', {})
  });


});


