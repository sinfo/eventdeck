var Hapi    = require('hapi');
var SocketIO  = require('socket.io');
var options = require('./options');
require('./db');

var server = module.exports.hapi = new Hapi.Server('0.0.0.0', 8765, options);

server.pack.require('hapi-auth-cookie', function (err) {

  server.auth.strategy('session', 'cookie', {
    password: 'secret',
    cookie: 'sid-example',
    redirectTo: '/login',
    isSecure: false
  });
  
  var routes = require('./routes');

  server.start(function () {
    console.log('Server started at: ' + server.info.uri);
    var webSocket = module.exports.webSocket = SocketIO.listen(server.listener);
/*    webSocket
      .of('/chat')
      .on('connection', function (socket) {
        console.log("Connected to main chat!");
        socket.on('auth', function(data){
          console.log(data.id);
        });
      });*/
    var sockets = require('./io');
  });

});