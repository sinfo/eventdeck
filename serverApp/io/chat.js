var webSocket = require('./../index.js').webSocket;
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
    /*socket.emit('init', { message: 'welcome to the chat' });*/
      socket.on('auth', function(data, cbClient){
        console.log("Chat ID: " + data.id);

        var room = data.id;
        var user = data.user;

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
        return callback('member');
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
      console.log('Member not valid in chat: ' + chatID );
      data.message = "You're not allowed into this chat!";
      data.err     = true;
    }
  }
  else{
    socket.join(room);
    var data = {
      room     : room,
      chatData : outChat,
      messages : messages,
      message  : message,
      err      : true
    }
  }
  cb(data);
}

function createMessage(cb){
  Message.create({payload: messageData}, function(response){
    if(response.error) {
      console.log('Message creation error!');
      console.log(response.error);
    } else {
      messageData.id = response.messageId;
    }
    cb();
  });
}

function updateChat(room, cb){
  Chat.update({params: { id: room}, payload: {message: messageData.id}}, function(response) {
    // if successful, we'll need to refresh the chat list
    if(response.error) {
      console.log('Chat id: ' + messageData.id + ' update error!');
      console.log(response.error);
    } else {
      console.log('Chat id: ' + messageData.id + ' updated successfully!');
    }
    cb();
  });
}