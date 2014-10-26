var log = require('server/helpers/logger');
var webSocket = require('server').webSocket.server;
var chatServer = require('./chat');
//var notificationServer = require('./notifications');

webSocket.on('connection', function (socket) {

	log.debug("[sockets] New user connected");
  socket.emit('connected');

  chatServer(socket);
  //notificationServer(socket);
});

require('./chat');