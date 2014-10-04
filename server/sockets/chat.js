var webSocket = require('./../index.js').webSocket.server;
var async = require('async');
var Chat = require('./../resources/chat');
var Message = require('./../resources/message');
var log = require('./../helpers/logger');

var outChat;
var messages;
var message;
var messageData;

webSocket
  .of('/chat')
  .on('connection', function (socket) {

    socket.emit('connected');

    log.debug("[sockets-chat] New user connected");

    socket.on('auth', function(data, cbClient){
      var room = data.id;
      var user = data.user;
      socket.nickname = user;
      async.parallel([
        function(cb){
          getChat(room, user, cb);
        },
        function(cb){
          getMessages(room, Date.now(), cb);
        }
      ], function(err, results){
          done(err, room, socket, cbClient);
      });
    });

    socket.on('send', function(data, cbClient){
      var room    = data.room;
      messageData = data.message;
      async.series([
        createMessage,
        function(cb){
          updateChat(room, cb);
        }
      ], function(){
          webSocket.of('/chat').in(room).emit('message', {message: messageData});
          log.debug("[sockets-chat] New message from " + socket.nickname + " sent");
          cbClient();
      });
    });

    socket.on('logout', function(data, cb){
      webSocket.of('/chat').in(data.room).emit('user-disconnected', {id: socket.nickname});
      log.debug("[sockets-chat] User " + socket.nickname + " disconnected");
      socket.disconnect();
      cb();
    });

    socket.on('disconnect', function(){
      delete socket;
    });

    socket.on('history-get', function(data, cb){
      var dateRef = data.date;
      var room = data.room;
      getMessages(room, dateRef, function(){
        webSocket.of('/chat').in(room).emit('history-send', {messages: messages});
        cb();
      });
    });

  });

function getChat(chatID, memberID, cb){
  Chat.get({params:{id: chatID}}, function(response) {
    if(response.error) {
      log.error('[sockets-chat] Chat id: ' + chatID + ' unavailable');
    } 
    else {
      message = 'Logged in chat with sucess';
      outChat = response;
      if(outChat.members.indexOf(memberID) === -1){
        return cb('member');
      }
    }
    cb();
  });
}

function getMessages(chatID, dateRef, cb){
  Message.getByChatId({params:{id: chatID, date: dateRef}}, function(response){
    if(response.error) {
      log.error('[sockets-chat] Chat id: ' + chatID + ' messages unavailable');
    } 
    else {
      messages = response;
    }
    cb();
  });
}

function done(err, room, socket, cb){
  var data = {};
  if(err){
    if(err === 'member'){
      log.error('[sockets-chat] Invalid member in chat: ' + room );
      data.message = "You're not allowed into this chat!";
      data.err     = true;
    }
  }
  else{
    var online  = [];
    socket.join(room);
    var clients = webSocket.of('/chat').sockets;
    for(var i = 0; i < clients.length; i++){
      if(clients[i].connected  && clients[i].nickname){
        online[i] = clients[i].nickname;
      }
    }
    var data = {
      room     : room,
      chatData : outChat,
      messages : messages,
      message  : message,
      online   : online,
      err      : false
    };
    webSocket.of('/chat').in(room).emit('user-connected', {id: socket.nickname});
  }
  socket.emit("validation", data);
  cb();
}

function createMessage(cb){
  Message.create({payload: messageData}, function(response){
    if(response.error) {
      log.error('[sockets-chat] Message creation error!', response.error);
    } else {
      messageData = response;
    }
    cb();
  });
}

function updateChat(room, cb){
  Chat.update({params: { id: room}, payload: {message: messageData.id}}, function(response) {
    if(response.error) {
      log.error('[sockets-chat] Chat id: ' + room + ' update error!', response.error);
    }
    cb();
  });
}