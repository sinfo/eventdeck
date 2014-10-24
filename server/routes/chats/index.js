var server = require('server').hapi;
var handlers = require('./handlers');


server.route({
  method: 'GET',
  path: '/chats',
  config: handlers.list
});

server.route({
  method: 'GET',
  path: '/chats/{id}',
  config: handlers.get
});

server.route({
  method: 'POST',
  path: '/chats',
  config: handlers.create
});

server.route({
  method: 'PUT',
  path: '/chats/{id}',
  config: handlers.update
});

server.route({
  method: 'DELETE',
  path: '/chats/{id}',
  config: handlers.remove
});
