var Boom = require('boom');
var log = require('server/helpers/logger');
var webSocket = require('server').webSocket.server;
var chatServer = require('./chat');
var notificationServer = require('./notification');

webSocket.on('connection', function (socket) {

	log.debug('[sockets] New user connected');

  socket.emit('connected');

  socket.on('init', function(data, cbClient){

    //MISSING USER AUTH CHECK

    var user = data.user;
    if(!user){
      return cbClient(Boom.unauthorized('Need valid user to connect'));
    }
    socket.nickname = user;
    socket.join(user);
/*    chatServer(socket);
    notificationServer(socket);*/
  });
});