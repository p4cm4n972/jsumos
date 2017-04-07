window.addEventListener('DOMContentLoaded', function () {
  console.log('JAVASCRIPT chargé !');
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  //GESTION DES LIMITES DE LA ZONE DE JEU
  var gameWidth = window.document.body.clientWidth;
  var gameHeight = window.document.body.clientHeight;
  //VARIABLES
  var joueur1 = document.getElementById("pseudo1");
  var joueur2 = document.getElementById("pseudo2");


  //GESTION DES PSEUDOS
  window.addEventListener("submit", function (e) {
    var pseudoValue = document.getElementById('pseudo').value;
    if (pseudoValue.trim().length == 0) {
      alert('Veillez rentrer un pseudo valide !');
      e.preventDefault();
    } else {
      socket.emit('login', {
        pseudoValue
      })
    }
  });
  socket.on('login', function (pseudoValue) {
    if (joueur1.innerText.length == 0) {
      joueur1.innerHTML = pseudoValue;
    } else {
      joueur2.innerHTML = pseudoValue;
    }




  })
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
      score = window.document.createElement('p');
      score.id = data.id;
      score.style.position = 'absolute';
      score.style.top = "40px";
      score.style.left = "40px";
      avatar.appendChild(score);
      total = data.total;
      score.innerText = this.total;
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
    bol.addEventListener('click', function (e) {
      var target = e.currentTarget.id;
      var clicker = e.view.socket.id;
      socket.emit('eat', {
        target,
        clicker
      })
    });
  }
  //TIMER
  var clock = function() {$('.clock').FlipClock({
    clockFace: 'MinuteCounter'
  });
  };
  //---------------------------------------------------------
  //GESTIONS DES EVENEMENTS / AVATARS
  socket.on('update', function (data) {
    drawAvatar(data.avatar);
  });
  
  //déplacements Avatars
  window.addEventListener('mousemove', function (event) {
    socket.emit('move', {
      top: event.clientY,
      left: event.clientX
    });
  });
  //destroy
  socket.on('destroy', function (data) {
    var avatar = window.document.getElementById(data.id);
    if (avatar) {
      avatar.parentNode.removeChild(avatar);
    };
  });

  //---------------------------------------------------------
  //GESTIONS DES EVENEMENTS / BOLS

  //lancement de l'animation
  if (joueur1.innerText.length > 0 && joueur2.innerText.length > 0) {
    socket.emit('start', {});
    socket.emit('clock', {});
  }
   socket.on('clock', function () {
    clock();
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
  socket.on('eatAction', function (clicking) {
    var eating = window.document.getElementById(clicking.target);
    var i = 1;
    if (eating) {
      eating.style.display = 'none';
      //GESTION DU SCORE
      var totalNumber = parseFloat(document.getElementById(clicking.clicker).firstElementChild.innerText);
      console.log(document.getElementById(clicking.clicker).firstChild);
      console.log(document.getElementById(clicking.clicker).firstElementChild);
      document.getElementById(clicking.clicker).firstElementChild.innerText = totalNumber + i;

    };
  });
  //


}); //END