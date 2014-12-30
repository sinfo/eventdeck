var Boom = require('boom');
var log = require('server/helpers/logger');
var IO = require('server').socket.server;
var chatServer = require('./chat');
var notifications = require('./notification');

IO.on('connection', function (socket) {

	log.debug('[sockets] New user connected');

  socket.emit('connected');

  socket.on('init', function(data, cbClient){

    //MISSING USER AUTH CHECK

    var user = data.user;
    if(!user){
      return cbClient(Boom.unauthorized('Need valid user to connect'));
    }
    socket.nickname = user.id;
    socket.join(user.id);
    notifications.setListeners(socket);
    cbClient();
  });
});

module.exports = {notification: {events: notifications.events}};