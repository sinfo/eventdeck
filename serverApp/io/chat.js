var webSocket = require('./../index.js').webSocket;

webSocket
	.of('/chat')
	.on('connection', function (socket) {
		console.log("Connected to main chat!");
		/*socket.emit('init', { message: 'welcome to the chat' });*/
	    socket.on('auth', function(data){
	    	socket.join(data.id);
	    });
  	});