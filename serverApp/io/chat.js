var webSocket = require('./../index.js').webSocket;
var Chat = require('./../resources/chat');
var Message = require('./../resources/message');

webSocket
  .of('/chat')
  .on('connection', function (socket) {
    console.log("Connected to main chat!");
    /*socket.emit('init', { message: 'welcome to the chat' });*/
      socket.on('auth', function(data, cb){
        console.log("Chat ID: " + data.id);

    var room = data.id;

    async.series([
      getMessage,
    ], done);

    Chat.get({id: room}, function(response) {
      if(response.error) {
        console.log('Chat id: ' + room + ' unavailable');
      } 
      else {
        console.log('Logged in chat id: ' + room );
        socket.join(room);
      } 
    });

    Message.getByChatId({id: room}, function(response){
      if(response.error) {
        console.log('Chat id: ' + room + ' messages unavailable');
      } 
      else {
        console.log('Got messages in chat id: ' + room );
        socket.join(room);
      } 
    }); 




    cb();
      });
    });

function getChat(chatID){

}