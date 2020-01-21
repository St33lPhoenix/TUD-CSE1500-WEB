const express = require('express');
const http = require('http');
const websocket = require('ws');

// Local
const indexRouter = require('./routes/index.js');
const st = require('./statustracker.js');
const game = require('./game.js');

var port = 1111;
var app = express();

app.use(express.static(__dirname + "/public"));

// Set our router
app.use('/', indexRouter);

var server = http.createServer(app);
var socketserver = new websocket.Server({server});
var conId = 0;
var current = null;
var sockets = {};

// On connect
socketserver.on('connection', function(ws) {

  var con = ws;

  // Set a connection ID
  con.id = conId++;
  if (current == null) {
    current = new game(st.gamesStarted++);
  }

  // Set the socket in the data map
  sockets[con.id] = current;

  // Start add the player and start it if the lobby is full
  current.addPlayer(con);
  if (current.isReady()) {
    current.start();
    current = null;
  }

  // On message
  con.on('message', function(message) {
    var inbound = JSON.parse(message);
    var gameObj = sockets[con.id];

    /*
     * Move message
     * type: 3 
     * column: <int>
     */
    if (inbound.type == 3) {
      gameObj.doMove(con, inbound.column);
    }

  });

  // On close
  con.on('close', function(code) {
    if (code != '1001') {
      return;
    }

    var gameObj = sockets[con.id];

    if (!gameObj.isOver()) {
      
      // Close p1
      if (gameObj.p1 != null) {
        gameObj.p1.close();
        gameObj.p1 = null;
      }

      // Close p2
      if (gameObj.p2 != null) {
        gameObj.p2.close();
        gameObj.p2 = null;
      }
    }
  });
  
});

// Cleanup task (every minute)
setInterval(function() {
  for (var i in sockets) {
    if (Object.prototype.hasOwnProperty.call(sockets, i)) {
      var game = sockets[i];
      if (game.isOver()) {
        delete sockets[i];
      }
    }
  }
}, 60000);


// Start listening
server.listen(port);

module.exports = app;