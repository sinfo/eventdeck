var webSocket = require('./../index.js').webSocket.server;

webSocket.on('connection', function (socket) {
	log.debug("[sockets] New user connected");

    socket.emit('connected');
});

require('./chat');