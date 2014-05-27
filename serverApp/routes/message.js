var server  = require('./../index.js').hapi;
var message = require('./../resources/message');

server.route({
  method: 'GET',
  path: '/api/messages',
  config: {
    handler: message.list,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/message',
  config: {
    handler: message.create,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/message/{id}',
  config: {
    handler: message.get,
    auth: true
  }
});
