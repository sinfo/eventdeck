var webSocket = require('./../index.js').webSocket.server;
var async = require('async');
var Chat = require('./../resources/chat');
var Message = require('./../resources/message');

var outChat;
var messages;
var message;
var messageData;

webSocket
  .of('/chat')
  .on('connection', function (socket) {
    console.log("Connected to main chat!");

    socket.emit('connected');

    socket.on('auth', function(data, cbClient){
      console.log("Chat ID: " + data.id);

      var room = data.id;
      var user = data.user;
      socket.nickname = user;
      async.parallel([
        function(cb){
          getChat(room, user, cb)
        },
        function(cb){
          getMessages(room, cb)
        }
      ], function(err, results){
          done(err, room, socket, cbClient);
      });
    });

    socket.on('send', function(data, cbClient){
      console.log("Sent message Chat ID: " + data.room);

      var room    = data.room;
      messageData = data.message; 

      async.series([
        createMessage,
        function(cb){
          updateChat(room, cb)
        }
      ], function(){
          webSocket.of('/chat').in(room).emit('message', messageData);
          cbClient();
      });
    });

    socket.on('logout', function(data, cb){
      console.log("Log out: " + socket.nickname);
      socket.disconnect();
      webSocket.of('/chat').in(data.room).emit('user:disconnected', {id: socket.nickname});
      cb();
    });

    socket.on('disconnect', function(){
      console.log("Disconnected: " + socket.nickname);
      delete socket;
    });

  });

function getChat(chatID, memberID, cb){
  Chat.get({params:{id: chatID}}, function(response) {
    if(response.error) {
      console.log('Chat id: ' + chatID + ' unavailable');
    } 
    else {
      console.log('Logged in chat id: ' + chatID );
      message = 'Logged in chat with sucess';
      outChat = response;
      if(outChat.members.indexOf(memberID) === -1){
        return cb('member');
      }
    }
    cb();
  });
}

function getMessages(chatID, cb){
  Message.getByChatId({params:{id: chatID}}, function(response){
    if(response.error) {
      console.log('Chat id: ' + chatID + ' messages unavailable');
    } 
    else {
      console.log('Got messages in chat id: ' + chatID );
      messages = response;
    }
    cb();
  });
}

function done(err, room, socket, cb){
  var data = {};
  if(err){
    if(err === 'member'){
      console.log('Invalid member in chat: ' + room );
      data.message = "You're not allowed into this chat!";
      data.err     = true;
    }
  }
  else{
    var online  = [];
    socket.join(room);
    var clients = webSocket.of('/chat').sockets;
    console.log("Currently Loged:");
    for(var i = 0; i < clients.length; i++){
      if(clients[i].connected  && clients[i].nicknam != 'server'){
        online[i] = clients[i].nickname;
        console.log(clients[i].nickname);
      }
    }
    var data = {
      room     : room,
      chatData : outChat,
      messages : messages,
      message  : message,
      online   : online,
      err      : false
    }
    webSocket.of('/chat').in(room).emit('user:connected', {id: socket.nickname});
  }
  socket.emit("validation", data);
  cb();
}

function createMessage(cb){
  Message.create({payload: messageData}, function(response){
    if(response.error) {
      console.log('Message creation error!');
      console.log(response.error);
    } else {
      messageData = response;
    }
    cb();
  });
}

function updateChat(room, cb){
  Chat.update({params: { id: room}, payload: {message: messageData.id}}, function(response) {
    if(response.error) {
      console.log('Chat id: ' + room + ' update error!');
      console.log(response.error);
    } else {
      console.log('Chat id: ' + room + ' updated successfully!');
    }
    cb();
  });
}