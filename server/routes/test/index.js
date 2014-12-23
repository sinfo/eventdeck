var server = require('server').hapi;
var socketServer = require('server').webSocket.server;


server.route({
  method: 'GET',
  path: '/api/test/notify',
  handler: function(request, reply){
    server.methods.notification.notifyCreate('francisco.dias', '/company', 'ericsson', function(err, result){
      socketServer.emit('notify-target', result);
      reply('testing-socket-notify');
    });
  }
});