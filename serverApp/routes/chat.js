var server  = require('./../index.js');
var chat    = require('./../resources/chat');
var message = require('./../resources/message');

server.route({
  method: 'POST',
  path: '/api/chat',
  config: {
    handler: chat.create,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/chat',
  config: {
    handler: chat.get,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/chat/{id}',
  config: {
    handler: chat.get,
    auth: true
  }
});

server.route({
  method: 'PUT',
  path: '/api/chat/{id}',
  config: {
    handler: chat.update,
    auth: true
  }
});

server.route({
  method: 'POST',
  path: '/api/chat/{id}',
  config: {
    handler: chat.post,
    auth: true
  }
});

server.route({
  method: 'GET',
  path: '/api/chat/{id}/messages',
  config: {
    handler: message.getByChatId,
    auth: true
  }
});
