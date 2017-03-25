window.addEventListener('DOMContentLoaded', function () {
  console.log('JAVASCRIPT chargé !');
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  //GESTION DES LIMITES DE LA ZONE DE JEU
  var gameWidth = window.document.body.clientWidth;
  var gameHeight = window.document.body.clientHeight;
  //--------------------------------------------------------
  //DESSINER LES AVATARS ET METTRE A JOUR LES EXISTANTS
  var drawAvatar = function (data) {
    var avatar = window.document.getElementById(data.id);
    if (!avatar) {
      avatar = window.document.createElement('div');
      avatar.id = data.id;
      avatar.style.width = data.width;
      avatar.style.height = data.height;
      avatar.style.position = 'absolute';
      window.document.body.appendChild(avatar);
    };
    avatar.style.top = data.top;
    avatar.style.left = data.left;
    avatar.style.backgroundImage = 'url(' + data.url + ')';
  };
  //--------------------------------------------------------
  //DESSINER LES BOLS
  var drawBol = function (coord) {
    bol = document.createElement('div');
    bol.id = coord.id;
    bol.setAttribute('class', 'monBol');
    bol.style.top = coord.top;
    bol.style.left = coord.left;

    bolImage = document.createElement('img');
    bolImage.src = coord.url;
    bol.appendChild(bolImage);
    bolImage.style.width = '50px';
    bolImage.style.height = '50px';
    bol.style.position = 'absolute';
    window.document.body.appendChild(bol);
    bol.addEventListener('click', function (e) { var target = e.currentTarget.id; console.log(target); socket.emit('eat', target) });
  }
  //---------------------------------------------------------
  //GESTIONS DES EVENEMENTS / AVATARS
  socket.on('update', function (data) {
    drawAvatar(data.avatar);
  });
  socket.on('destroy', function (data) {
    var avatar = window.document.getElementById(data.id);
    if (avatar) {
      avatar.parentNode.removeChild(avatar);
    };
  });
  window.addEventListener('mousemove', function (event) {
    socket.emit('move', {
      top: event.clientY,
      left: event.clientX
    });
  });
  //---------------------------------------------------------
  //GESTIONS DES EVENEMENTS / BOLS
  window.document.addEventListener('keydown', function (k) {
    if (k.keyCode == 32) {
      socket.emit('start', {});
    }
  });
  //apparation des bols
  socket.on('animation', function (coord) {
    drawBol(coord);
  });
  //animation des bols
  socket.on('animation', function (coord) {
    var bolArray = [];
    bolArray.push(coord);
    var l = 2;
    var h = 0;
    var bolAnimate = function () {
      requestAnimationFrame(bolAnimate);
      bolArray.forEach(function (element) {
        var img = document.getElementById(element.id);
        img.style.left = parseFloat(img.style.left) + l + 'px';
        img.style.top = parseFloat(img.style.top) + h + 'px';
        if (parseFloat(img.style.left) >= gameWidth || parseFloat(img.style.left) <= 0) {
          l *= -1;
          h = -1;
          img.style.left = parseFloat(img.style.left) + l + 'px';
          img.style.top = parseFloat(img.style.top) + h + 'px';
        };
        if (parseFloat(img.style.top) >= gameHeight || parseFloat(img.style.top) <= 100) {
          h *= -1;
          img.style.top = parseFloat(img.style.top) + h + 'px';
        };
      });
    };
  bolAnimate();
  });
  //disparition des bols cliqués
  socket.on('eatAction', function (target) {
    console.log(target);
    var eating = window.document.getElementById(target);
    if (eating) {
      eating.parentNode.removeChild(eating);
    };
  });
  //


});//END
