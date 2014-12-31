var Boom = require('boom');
var log = require('server/helpers/logger');
var IO = require('server').socket.server;
var chatServer = require('./chat');
var notifications = require('./notification');

IO.on('connection', function (socket) {

	log.debug('[sockets] New user connected');

  socket.emit('connected');

  socket.on('init', function(request, cbClient){

    //MISSING USER AUTH CHECK

    var user = request.data;
    if(!user || typeof user.id === 'undefined' || user.id === null){
      return cbClient(Boom.unauthorized('Need valid user to connect'));
    }
    log.debug(user);
    socket.nickname = user.id;
    socket.join(user.id);
    notifications.setListeners(socket);
    cbClient();
  });
});

module.exports = {notification: {events: notifications.events}};