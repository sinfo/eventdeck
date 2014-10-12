var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/api/chats',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/api/chats/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/api/chats',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/api/chats/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/api/chats/{id}',
  config: handlers.remove
});
