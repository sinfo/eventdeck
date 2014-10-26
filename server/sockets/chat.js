var async = require('async');
var server = require('server');
var log = require('server/helpers/logger');
var webSocket = server.webSocket.server;

function chatServer(socket){

  var outChat;
  var messages;
  var message;
  var messageData;

  socket.on('chat-auth', function(data, cbClient){
    var room = data.id;
    var user = data.user;
    var query = data.query;
    socket.nickname = user;
    async.parallel([
      function(cb){
        server.methhods.chat.get(room, cb);
      },
      function(cb){
        server.methods.message.getByChat(room, query, cb);
      }
    ], function(err, results){
        done(err, user, room, results);
    });
  });

  socket.on('chat-send', function(data, cbClient){
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

  socket.on('chat-logout', function(data, cb){
    webSocket.in(data.room).emit('user-disconnected', {id: socket.nickname});
    log.debug("[socket-chat] User " + socket.nickname + " disconnected");
    socket.disconnect();
    cb();
  });

  socket.on('chat-disconnect', function(){
    webSocket.in(room).emit('user-disconnected', {id: socket.nickname});
  });

  socket.on('chat-page', function(data, cb){
    var dateRef = data.date;
    var room = data.room;
    getMessages(room, dateRef, function(){
      webSocket.in(room).emit('history-send', {messages: messages});
      cb();
    });
  });



  function done(err, user, room, results){
    var chat = results[0];
    var messages = results[1];

    //MISSING USER AUTH CHECK

    if(err){
      log.error({err: err, chat: chat.id, user: user}, '[socket-chat] error on auth');
      socket.emit('error', err);
      return;
    }
    var online  = [];
    socket.join(room);
    var clients = webSocket.sockets;
    for(var i = 0; i < clients.length; i++){
      if(clients[i].connected  && clients[i].nickname){
        online[i] = clients[i].nickname;
      }
    }
    var data = {
      room     : room,
      chatData : chat,
      messages : messages,
      online   : online
    };
    webSocket.in(room).emit('user-connected', {id: socket.nickname});
    socket.emit("validation", data);
  }
}

module.exports = chatServer;