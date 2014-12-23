var server = require('server').hapi;
var socketServer = require('server').webSocket.server;


server.route({
  method: 'GET',
  path: '/api/test/notify',
  handler: function(request, reply){
    socketServer.emit('notify-target', {test: 'test'});
    reply('testing-socket-notify');
  }
});