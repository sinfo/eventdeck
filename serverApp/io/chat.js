var webSocket = require('./../index.js').webSocket;
var async = require('async');
var Chat = require('./../resources/chat');
var Message = require('./../resources/message');

var outChat;
var messages;
var message;

webSocket
  .of('/chat')
  .on('connection', function (socket) {
    console.log("Connected to main chat!");
    /*socket.emit('init', { message: 'welcome to the chat' });*/
      socket.on('auth', function(data, cbClient){
        console.log("Chat ID: " + data.id);

        var room = data.id;

        async.parallel([
          function(cb){
            getChat(room, cb)
          },
          function(cb){
            getMessages(room, cb)
          }
        ], function(){
            done(room, socket, cbClient);
          });
      });
    

  });

function getChat(chatID, cb){
  Chat.get({params:{id: chatID}}, function(response) {
    if(response.error) {
      console.log('Chat id: ' + chatID + ' unavailable');
    } 
    else {
      console.log('Logged in chat id: ' + chatID );
      message = 'Logged in chat with sucess';
      outChat = response;
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

function done(room, socket, cb){
  socket.join(room);
  var chatData = outChat;
  chatData.messages = messages;
  var data = {
    room     : room,
    chatData : chatData,
    message  : message
  }
  cb(data);
}