var server = require('server').hapi;
var socketServer = require('server').socket.server;


server.route({
  method: 'GET',
  path: '/api/test/notify',
  handler: function(request, reply){
    server.methods.notification.notifyCreate('francisco.dias', '/companies', {id: 'ericsson'}, function(err, result){
      socketServer.emit('notify-target', result);
      reply('testing-socket-notify');
    });
  }
});