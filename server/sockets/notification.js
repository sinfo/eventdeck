var async = require('async');
var server = require('server');
var log = require('server/helpers/logger');
var webSocket = server.webSocket.server;

function notificationServer(socket){

  socket.on('notification-init', function(data, cbClient){
    //stuff
  });

  socket.on('notify', function(data, cbClient){
    var room    = data.room;
    messageData = data.message;
    async.series([
      createMessage,
      function(cb){
        updateChat(room, cb);
      }
    ], function(){
        webSocket.in(room).emit('message', {message: messageData});
        log.debug("[socket-chat] New message from " + socket.nickname + " sent");
        cbClient();
    });
  });
}

module.exports = notificationServer;